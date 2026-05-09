import shutil
import subprocess
from pathlib import Path
from uuid import uuid4

from df.enhance import enhance, init_df, load_audio, save_audio
from fastapi import BackgroundTasks, FastAPI, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

# Load model once at startup — stays in memory for all requests
_model, _df_state, _ = init_df()

MAX_UPLOAD_BYTES = 50 * 1024 * 1024  # 50 MB


class MaxUploadSizeMiddleware(BaseHTTPMiddleware):
    """Reject requests whose Content-Length exceeds the configured limit."""

    async def dispatch(self, request: Request, call_next):
        content_length = request.headers.get("content-length")
        if content_length and int(content_length) > MAX_UPLOAD_BYTES:
            return JSONResponse(
                status_code=413,
                content={"detail": f"File too large. Maximum allowed size is {MAX_UPLOAD_BYTES // (1024 * 1024)} MB."},
            )
        return await call_next(request)


app = FastAPI(title="AI Video Denoiser")

# Order matters: CORS must wrap everything, size check comes next.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(MaxUploadSizeMiddleware)


def _cleanup(work_dir: Path) -> None:
    shutil.rmtree(work_dir, ignore_errors=True)


@app.post("/api/denoise")
async def denoise(file: UploadFile, background_tasks: BackgroundTasks) -> FileResponse:
    if not file.filename or not file.filename.lower().endswith(".mp4"):
        raise HTTPException(status_code=400, detail="Only .mp4 files are accepted.")

    uid = uuid4().hex
    work_dir = Path(f"temp_{uid}")
    work_dir.mkdir(parents=True, exist_ok=True)

    input_path = work_dir / "input.mp4"

    try:
        contents = await file.read()
        if len(contents) > MAX_UPLOAD_BYTES:
            raise HTTPException(
                status_code=413,
                detail=f"File too large. Maximum allowed size is {MAX_UPLOAD_BYTES // (1024 * 1024)} MB.",
            )
        input_path.write_bytes(contents)

        # Step 1: extract audio track as 48 kHz mono WAV
        subprocess.run(
            [
                "ffmpeg", "-y",
                "-i", "input.mp4",
                "-vn", "-ar", "48000", "-ac", "1",
                "audio.wav",
            ],
            cwd=work_dir,
            check=True,
            capture_output=True,
        )

        # Step 2: AI denoising via DeepFilterNet3 (Python API — avoids subprocess conflicts)
        audio, _ = load_audio(str(work_dir / "audio.wav"), sr=_df_state.sr())
        enhanced = enhance(_model, _df_state, audio)
        save_audio(str(work_dir / "audio_DeepFilterNet3.wav"), enhanced, _df_state.sr())

        # Step 3: mux denoised audio back into the original video
        subprocess.run(
            [
                "ffmpeg", "-y",
                "-i", "input.mp4",
                "-i", "audio_DeepFilterNet3.wav",
                "-c:v", "copy",
                "-map", "0:v:0",
                "-map", "1:a:0",
                "final.mp4",
            ],
            cwd=work_dir,
            check=True,
            capture_output=True,
        )

    except HTTPException:
        _cleanup(work_dir)
        raise
    except subprocess.CalledProcessError as exc:
        _cleanup(work_dir)
        stderr = exc.stderr.decode(errors="replace") if exc.stderr else ""
        raise HTTPException(status_code=500, detail=f"Processing failed: {stderr[:500]}")
    except Exception:
        _cleanup(work_dir)
        raise HTTPException(status_code=500, detail="Unexpected server error.")

    background_tasks.add_task(_cleanup, work_dir)

    return FileResponse(
        path=work_dir / "final.mp4",
        media_type="video/mp4",
        filename="denoised.mp4",
    )


@app.get("/health")
async def health() -> dict:
    return {"status": "ok"}
