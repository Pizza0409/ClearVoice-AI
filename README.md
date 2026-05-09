# AI 影片降噪神器 (AI Video Denoiser)

使用 [DeepFilterNet3](https://github.com/Rikorose/DeepFilterNet) AI 模型，一鍵消除影片背景雜音。本專案整合了深度學習音訊處理與全端部署技術，提供簡約、高效的降噪體驗。

- English version: [README.en.md](README.en.md)

- **前端 (Frontend)**: Next.js 14 (Deployed on Vercel)
- **後端 (Backend)**: FastAPI + Docker (Deployed on Hugging Face Spaces)

---

## 架構 (Architecture)

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

## 資料夾結構 (Project Structure)

```text
aiNoiseFilter/
├── backend/
│   ├── app.py             # FastAPI 主程式 (POST /api/denoise)
│   ├── requirements.txt   # Python 依賴 (已鎖定版本)
│   └── Dockerfile         # 包含 ffmpeg 與 git 的系統環境
└── frontend/
    ├── package.json
    ├── .env.local.example
    └── app/               # Next.js App Router (Tailwind CSS)
```

---

## 本機啟動 (Local Development)

### 前置條件 (Prerequisites)

- macOS / Linux / Windows (WSL2)
- Python 3.11+
- Node.js 18+
- **FFmpeg**:
  - macOS: `brew install ffmpeg`
  - Ubuntu/Debian: `sudo apt install ffmpeg`

### 1. 後端 (Backend)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# 重要：確保安裝相容版本以避免 torchaudio 導入錯誤
pip install torch==2.2.2 torchaudio==2.2.2 deepfilternet==0.5.6 fastapi uvicorn python-multipart
uvicorn app:app --reload --port 7860
```

後端啟動於 `http://localhost:7860`。

### 2. 前端 (Frontend)

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

前端啟動於 `http://localhost:3000`。

---

## 部署 (Deployment)

### 後端 → Hugging Face Spaces

1. 建立一個新的 Space，SDK 選擇 **Docker**。
2. 將 `backend/` 資料夾下的內容推送至 Space 倉庫。
3. **注意**：免費方案的 Space 在閒置後會休眠，首次請求可能需要 30-60 秒喚醒並下載模型權重（約 200MB）。

### 前端 → Vercel

1. 匯入 GitHub 倉庫。
2. 將 **Root Directory** 設定為 `frontend`。
3. 設定環境變數 `NEXT_PUBLIC_API_URL` 為你的 Hugging Face Space 網址。

---

## 技術重點 (Technical Highlights)

- **版本相容性 (Version Compatibility)**: 本專案強制鎖定 `torchaudio==2.2.2`。在 `2.3.0` 之後的版本中，`torchaudio.backend` 模組被移除，會導致 `DeepFilterNet` 初始化失敗。
- **音訊重採樣 (Audio Resampling)**: DeepFilterNet 針對 48kHz / Mono 流程進行了最佳化。本系統在推論前會自動透過 `ffmpeg` 完成轉換。
- **Docker 環境修正**: Dockerfile 中預裝了 `git` 以解決 DeepFilterNet 在初始化 Logger 時對 Git Commit Hash 的依賴問題。
- **隱私與安全性**: 系統採用無狀態 (Stateless) 設計，處理完成後會立即刪除暫存影片。

---

## 授權與致謝 (Credits & License)

- **AI Model**: [DeepFilterNet](https://github.com/Rikorose/DeepFilterNet) by Rikorose.
- **License**: 本專案採用 **MIT License**。
- **Note**: DeepFilterNet 模型本身對非商業用途免費，商業用途請遵循其官方授權協議。
