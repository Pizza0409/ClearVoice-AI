---
title: AI Video Denoiser
emoji: 🎬
colorFrom: gray
colorTo: blue
sdk: docker
app_port: 7860
pinned: false
---

# AI Video Denoiser — Backend

FastAPI service that removes background noise from uploaded MP4 videos using [DeepFilterNet3](https://github.com/Rikorose/DeepFilterNet).

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/denoise` | Upload an `.mp4` file, receive a denoised `.mp4` |
| `GET` | `/health` | Health check |

## Local Development

```bash
# macOS: brew install ffmpeg
pip install -r requirements.txt
uvicorn app:app --reload --port 7860
```

## Docker

```bash
docker build -t ai-denoiser .
docker run -p 7860:7860 ai-denoiser
```

## DeepFilterNet Runtime Notes

This backend uses `deepfilternet` (DeepFilterNet3) from:
https://github.com/Rikorose/DeepFilterNet

- The denoise path is optimized around **48kHz mono audio**. We always extract audio to 48kHz/mono before enhancement.
- Model weights are downloaded on first use and cached (cold start will be slower).
- Common startup logs such as:
  - `AudioMetaData has been moved`
  - `fatal: not a git repository`
  are usually harmless warnings and do not mean inference failed.
- If `/api/denoise` fails, inspect the returned `detail` field first; startup container logs alone are often not enough.

## Hugging Face Spaces Push Notes

- Use an HF **Access Token (write permission)** for Git operations.
- Account password authentication is deprecated for HF Git.
- Keep tokens out of repository files and remote URLs.
