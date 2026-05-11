'use client';

import { useLanguage } from "../language-provider";

export default function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  const base =
    "px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-90";

  return (
    <div
      className="flex shrink-0 rounded-md border border-zinc-800 overflow-hidden"
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => setLocale("zh")}
        aria-pressed={locale === "zh"}
        className={`${base} ${
          locale === "zh" ? "bg-white text-black" : "bg-transparent text-zinc-400"
        }`}
      >
        中文
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        className={`${base} border-l border-zinc-800 ${
          locale === "en" ? "bg-white text-black" : "bg-transparent text-zinc-400"
        }`}
      >
        EN
      </button>
    </div>
  );
}
