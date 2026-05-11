# ClearVoice AI — AI Video Denoiser

> One-click AI denoising for short-form video: make voices pop and cut background noise—free in the browser.

**Traditional Chinese README:** [README.zh.md](README.zh.md)

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-black?style=flat-square&logo=vercel)](https://clear-voice-ai.vercel.app/)
[![Hugging Face Space](https://img.shields.io/badge/%F0%9F%A4%97%20Hugging%20Face-Spaces-yellow?style=flat-square)](https://huggingface.co/spaces/pizza0409/ClearVoice-AI)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)

[Try the live demo](https://clear-voice-ai.vercel.app/) · [简体中文 / 繁體說明](README.zh.md)

---

## Why this exists

Great audio keeps people watching **Reels, TikTok, and YouTube Shorts**. Many creators hit the same limits:

* **Environmental noise** — traffic, crowds, wind
* **Gear / room noise** — AC hum, laptop fans
* **Budget** — no pro mic yet

**ClearVoice AI** uses **[DeepFilterNet3](https://github.com/Rikorose/DeepFilterNet)** to reduce non-speech noise while keeping voices clear—upload an `.mp4` in the browser, no desktop app install.

---

## Features

* **One click** — drag & drop `.mp4`, processing in the cloud
* **DeepFilterNet3** — perceptual speech enhancement tuned for clarity
* **Privacy-minded** — stateless flow; temp uploads are cleaned up after response
* **Minimal UI** — Next.js-inspired dark layout, focused workflow

---

## Architecture

Modern split stack: Next.js frontend (Vercel) talks directly to FastAPI backend (Docker on Hugging Face Spaces).

```text
Browser  ──(FormData POST)──►  Next.js 14 (Vercel)
                                      │
                              NEXT_PUBLIC_API_URL
                                      │
                                      ▼
                           FastAPI (HF Spaces :7860)
                           ├─ ffmpeg: extract / resample audio (48 kHz mono)
                           ├─ DeepFilterNet3: neural denoise
                           └─ ffmpeg: mux cleaned audio → output MP4
```

---

## Project structure

```text
aiNoiseFilter/
├── README.md              # English (default for GitHub)
├── README.zh.md           # Traditional Chinese
├── backend/
│   ├── app.py             # POST /api/denoise
│   ├── requirements.txt   # pinned Python deps
│   └── Dockerfile         # ffmpeg + Python runtime (+ git where needed)
└── frontend/
    ├── package.json
    ├── next.config.mjs
    ├── .env.local.example
    ├── public/
    │   └── og-image.png    # Open Graph preview (replace with branded art)
    └── app/
        ├── layout.tsx     # fonts + SEO metadata
        ├── page.tsx       # main UI (client-side)
        ├── robots.ts
        ├── sitemap.ts
        └── components/
```

---

## Local development

### Prerequisites

* macOS / Linux / Windows (WSL2 recommended on Windows)
* Python 3.11+
* Node.js 18+
* **FFmpeg**
  * macOS: `brew install ffmpeg`
  * Ubuntu/Debian: `sudo apt install ffmpeg`

### 1) Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate

# Match torchaudio 2.2.x — newer releases can break DeepFilterNet imports
pip install torch==2.2.2 torchaudio==2.2.2 deepfilternet==0.5.6 fastapi uvicorn python-multipart
uvicorn app:app --reload --port 7860
```

### 2) Frontend

```bash
cd frontend
cp .env.local.example .env.local
# Edit .env.local: NEXT_PUBLIC_API_URL (backend) + NEXT_PUBLIC_SITE_URL (canonical site URL for SEO)

npm install
npm run dev
```

---

## Deployment

### Backend — Hugging Face Spaces (Docker SDK)

1. Create a Space with SDK **Docker**.
2. Push the contents of [`backend/`](backend/) to the Space repo.
3. Cold starts on the free tier can take ~30–60s; first inference may download model weights (~200 MB).

### Frontend — Vercel

1. Import this GitHub repository.
2. Set **Root Directory** to `frontend`.
3. Add environment variables:
   | Name | Example |
   |------|---------|
   | `NEXT_PUBLIC_API_URL` | `https://<your-space>.hf.space` |
   | `NEXT_PUBLIC_SITE_URL` | `https://clear-voice-ai.vercel.app` |

Rebuild after changing env vars so Open Graph URLs resolve correctly.

### SEO checklist (short)

* Set **`NEXT_PUBLIC_SITE_URL`** on Vercel to your production URL.
* Replace [`frontend/public/og-image.png`](frontend/public/og-image.png) with a **1200×630** branded image.
* Submit the site URL in [Google Search Console](https://search.google.com/search-console) after deploy.

---

## Technical notes

* **`torchaudio==2.2.2`** — DeepFilterNet relies on APIs removed in newer torchaudio; pin versions per [`backend/requirements.txt`](backend/requirements.txt).
* **48 kHz mono** — ffmpeg normalizes audio before inference (DeepFilterNet’s sweet spot).
* **Docker `git`** — some DeepFilterNet logging paths assume a git repo; installing `git` in the image avoids noisy failures.

---

## Credits & license

* **Model / research**: [DeepFilterNet](https://github.com/Rikorose/DeepFilterNet) by Rikorose (see upstream license for redistribution / commercial terms).
* **This repository**: MIT.
