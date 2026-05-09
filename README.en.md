# AI Video Denoiser

A full-stack web application that removes background noise from videos using [DeepFilterNet3](https://github.com/Rikorose/DeepFilterNet).

- **Frontend**: Next.js 14 (deploy on Vercel)
- **Backend**: FastAPI + Docker (deploy on Hugging Face Spaces)

---

## Architecture

```text
Browser  ──(FormData POST)──►  Next.js 14 (Vercel)
                                      │
                              NEXT_PUBLIC_API_URL
                                      │
                                      ▼
                           FastAPI (HF Spaces :7860)
                           ├─ ffmpeg: extract/resample audio (48kHz)
                           ├─ DeepFilterNet3: perceptual denoise
                           └─ ffmpeg: mux back → final.mp4
```

## Project Structure

```text
aiNoiseFilter/
├── backend/
│   ├── app.py             # FastAPI app (POST /api/denoise)
│   ├── requirements.txt   # Python dependencies (pinned)
│   └── Dockerfile         # System dependencies incl. ffmpeg and git
└── frontend/
    ├── package.json
    ├── .env.local.example
    └── app/               # Next.js App Router (Tailwind CSS)
```

---

## Local Development

### Prerequisites

- macOS / Linux / Windows (WSL2)
- Python 3.11+
- Node.js 18+
- **FFmpeg**
  - macOS: `brew install ffmpeg`
  - Ubuntu/Debian: `sudo apt install ffmpeg`

### 1) Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\\Scripts\\activate

# Important: use compatible versions to avoid torchaudio import issues
pip install torch==2.2.2 torchaudio==2.2.2 deepfilternet==0.5.6 fastapi uvicorn python-multipart
uvicorn app:app --reload --port 7860
```

Backend runs at `http://localhost:7860`.

### 2) Frontend

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`.

---

## Deployment

### Backend -> Hugging Face Spaces

1. Create a new Space and choose **Docker** as SDK.
2. Push the contents of `backend/` to the Space repository.
3. Note: on the free tier, Spaces can sleep when idle. The first request may take 30-60 seconds and may trigger model download (~200MB).

### Frontend -> Vercel

1. Import your GitHub repository.
2. Set **Root Directory** to `frontend`.
3. Add environment variable:

- `NEXT_PUBLIC_API_URL=https://<your-username>-<your-space-name>.hf.space`

4. Deploy.

---

## Technical Highlights

- **Version Compatibility**: this project pins `torchaudio==2.2.2`. Newer versions may break DeepFilterNet due to backend API changes.
- **Audio Resampling**: DeepFilterNet is optimized for 48kHz mono. The backend always converts input audio using ffmpeg before inference.
- **Docker Runtime Fix**: `git` is installed in the Docker image to avoid runtime issues when DeepFilterNet tries to read git metadata.
- **Stateless Processing**: per-request temp folders are cleaned after response, minimizing storage leakage risk.

---

## Credits & License

- **AI Model**: [DeepFilterNet](https://github.com/Rikorose/DeepFilterNet) by Rikorose.
- **Project License**: MIT.
- **Note**: Please review DeepFilterNet's original license terms for your intended usage (especially commercial usage).
