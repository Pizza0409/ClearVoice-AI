# 🎬 AI 影片降噪神器 | AI Video Denoiser
> **一鍵消除背景雜訊，讓你的短影音人聲瞬間變專業！專業級 AI 降噪，創作者的最佳助手。**

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-black?style=flat-square&logo=vercel)](https://clear-voice-ai.vercel.app/)
[![HuggingFace Space](https://img.shields.io/badge/%F0%9F%A4%97%20Hugging%20Face-Spaces-yellow?style=flat-square)](https://huggingface.co/spaces/Pizza0409/ClearVoice-AI)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)

[🚀 立即使用 (Web Demo)](https://clear-voice-ai.vercel.app/) | [📖 English Version](README.en.md)

---

## 💡 為什麼需要這個工具？
在 **Reels、TikTok、YouTube Shorts** 盛行的時代，聲音品質直接決定了觀眾的留存率。
許多創作者在初期設備不足或在戶外拍攝時，常受限於以下痛點：
*   ❌ **環境雜訊**：嘈雜的街頭車流聲、人群喧嘩、風聲。
*   ❌ **設備底噪**：室內空調、電腦風扇的嗡嗡聲。
*   ❌ **預算限制**：尚未購買昂貴的專業降噪麥克風。

**AI 影片降噪神器** 透過先進的 **DeepFilterNet3** 深度學習模型，精準過濾非人聲雜訊並使人聲突出，讓你在零成本的情況下，簡單提升影片品質。

---

## ✨ 功能亮點 (Key Features)
*   🚀 **一鍵操作**：無須安裝軟體，瀏覽器直接上傳即可自動處理。
*   🤖 **頂尖 AI 模型**：採用感知音訊增強模型 DeepFilterNet3，人聲保留度極高。
*   🔒 **隱私安全**：無狀態 (Stateless) 設計，處理完畢立即刪除暫存檔。
*   📱 **極簡美學**：受 Nextjs.org 啟發的開發者風格介面，操作流暢。

---

## 🏗 技術架構 (Architecture)

本專案採用現代化全端架構，確保影音處理的高性能與穩定性：

```text
Browser  ──(FormData POST)──►  Next.js 14 (Vercel)
                                      │
                              NEXT_PUBLIC_API_URL
                                      │
                                      ▼
                           FastAPI (HF Spaces :7860)
                           ├─ ffmpeg: 提取並重採樣音訊 (48kHz)
                           ├─ DeepFilterNet3: 深度神經網路推論
                           └─ ffmpeg: 重新封裝音軌 → 導出 MP4

```

---

## 📂 資料夾結構 (Project Structure)

```text
aiNoiseFilter/
├── README.md              # 繁體中文說明文件
├── README.en.md           # English Documentation
├── .gitignore             # Git 忽略設定
├── backend/               # 後端實作 (FastAPI)
│   ├── app.py             # API 主程式 (處理音訊提取與模型推論)
│   ├── requirements.txt   # Python 依賴環境 (已鎖定版本)
│   └── Dockerfile         # 封裝 ffmpeg 與深度學習環境
└── frontend/              # 前端實作 (Next.js 14)
    ├── package.json       # Node.js 依賴與腳本
    ├── next.config.mjs    # Next.js 配置
    ├── .env.local.example # 環境變數範例
    └── app/               # Next.js App Router 介面與邏輯
        ├── layout.tsx     # 全域佈局與 SEO Meta Tags
        ├── page.tsx       # 主頁面邏輯
        ├── globals.css    # 全域樣式 (Tailwind CSS)
        └── components/    # 封裝 UI 組件
            ├── Dropzone.tsx     # 檔案拖放區
            ├── Spinner.tsx      # 載入動畫
            └── ResultPlayer.tsx # 結果播放與下載器

```

---

## 🛠 本機啟動 (Local Development)

### 前置條件 (Prerequisites)

* macOS / Linux / Windows (WSL2)
* Python 3.11+
* Node.js 18+
* **FFmpeg**:
* macOS: `brew install ffmpeg`
* Linux: `sudo apt install ffmpeg`



### 1. 後端 (Backend)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# 重要：確保安裝相容版本以避免 torchaudio 導入錯誤
pip install torch==2.2.2 torchaudio==2.2.2 deepfilternet==0.5.6 fastapi uvicorn python-multipart
uvicorn app:app --reload --port 7860

```

### 2. 前端 (Frontend)

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev

```

---

## 🚀 部署 (Deployment)

### 後端 (Hugging Face Spaces)

1. 建立一個新的 Space，SDK 選擇 **Docker**。
2. 將 `backend/` 目錄內容推送至該 Space。
3. **注意**：免費版 Space 在閒置後會自動休眠，首次請求需等待約 30 秒喚醒並載入模型權重。

### 前端 (Vercel)

1. 匯入 GitHub 倉庫。
2. 將 **Root Directory** 設定為 `frontend`。
3. 在 Vercel 環境變數中設定 `NEXT_PUBLIC_API_URL` 指向您的 HF Space 地址。

---

## ⚠️ 技術開發筆記 (Technical Highlights)

為了讓模型在生產環境穩定運行，我們解決了以下技術挑戰：

* **版本鎖定**：強制鎖定 `torchaudio==2.2.2`。2.3.0 之後的版本移除了 `torchaudio.backend`，會導致模型初始化崩潰。
* **音訊重採樣**：DeepFilterNet 針對 48kHz/Mono 流程優化。系統會自動透過 `ffmpeg` 完成格式轉換，無需用戶手動處理。
* **Docker 修正**：Dockerfile 中預裝了 `git`，解決了 DeepFilterNet 初始化 Logger 時對 Git Commit Hash 的依賴。

---

## 📜 授權與致謝 (Credits & License)

* **AI Model**: [DeepFilterNet](https://github.com/Rikorose/DeepFilterNet) by Rikorose.
* **License**: 本專案採用 **MIT License**。
* **Note**: DeepFilterNet 模型本身對非商業用途免費，商業使用請遵循原作者授權條款。