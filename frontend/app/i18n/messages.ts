export type Locale = "zh" | "en";

export const messages = {
  zh: {
    title: "AI 影片終極降噪神器",
    subtitle: "上傳影片，AI 自動消除背景雜音",
    dropzoneLead: "拖曳",
    dropzoneMp4: ".mp4",
    dropzoneTrail: "至此，或點擊選擇檔案",
    dropzoneFootnote: "僅支援 MP4 格式，上限 50 MB",
    dropzoneTooLarge: "檔案超過 50 MB 限制，請選擇較小的影片",
    startDenoise: "開始降噪",
    processing: "處理中…",
    processingHint: "AI 正在處理中，這可能需要幾十秒，請稍候…",
    error: "處理失敗，請稍後再試或檢查影片格式",
    reupload: "重新上傳",
    download: "下載降噪後影片",
  },
  en: {
    title: "AI Video Denoiser",
    subtitle: "Upload an MP4—AI removes background noise",
    dropzoneLead: "Drag ",
    dropzoneMp4: ".mp4",
    dropzoneTrail: " here or click to choose a file",
    dropzoneFootnote: "MP4 only, max 50 MB",
    dropzoneTooLarge: "This file exceeds the 50 MB limit. Choose a smaller video.",
    startDenoise: "Remove noise",
    processing: "Processing…",
    processingHint:
      "The model is running—this can take tens of seconds. Please wait…",
    error: "Something went wrong. Try again later or check the file format.",
    reupload: "Upload another",
    download: "Download denoised video",
  },
} satisfies Record<Locale, Record<string, string>>;

export type Translation = (typeof messages)["zh"];
