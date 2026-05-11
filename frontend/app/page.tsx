'use client';

import { useCallback, useState } from 'react';
import Dropzone from './components/Dropzone';
import LanguageToggle from './components/LanguageToggle';
import ResultPlayer from './components/ResultPlayer';
import Spinner from './components/Spinner';
import { useLanguage } from './language-provider';

type Status = 'idle' | 'file-selected' | 'processing' | 'done' | 'error';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:7860';

export default function Home() {
  const { locale, t } = useLanguage();
  const [status, setStatus] = useState<Status>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleFileSelected = useCallback((selected: File) => {
    setFile(selected);
    setStatus('file-selected');
  }, []);

  const handleDenoise = async () => {
    if (!file) return;

    setStatus('processing');

    try {
      const form = new FormData();
      form.append('file', file);

      const res = await fetch(`${API_URL}/api/denoise`, {
        method: 'POST',
        body: form,
      });

      if (!res.ok) throw new Error(`Server responded with ${res.status}`);

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  const handleReset = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);
    setFile(null);
    setStatus('idle');
  };

  const isProcessing = status === 'processing';
  const showDropzone = status !== 'done';

  return (
    <main
      lang={locale === 'en' ? 'en' : 'zh-Hant'}
      className="min-h-screen flex items-center justify-center px-6 py-16"
    >
      <div className="w-full max-w-xl space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 min-w-0 flex-1">
            <h1 className="text-3xl font-semibold tracking-tight text-[#ededed]">
              {t.title}
            </h1>
            <p className="text-sm text-zinc-400">{t.subtitle}</p>
          </div>
          <LanguageToggle />
        </div>

        {showDropzone && (
          <Dropzone onFileSelected={handleFileSelected} disabled={isProcessing} />
        )}

        {status === 'file-selected' && (
          <button
            onClick={handleDenoise}
            className="w-full bg-white text-black rounded-md px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {t.startDenoise}
          </button>
        )}

        {isProcessing && (
          <div className="space-y-4">
            <button
              disabled
              className="w-full flex items-center justify-center gap-2 bg-white text-black rounded-md px-4 py-2 text-sm font-medium opacity-70 cursor-not-allowed"
            >
              <Spinner />
              {t.processing}
            </button>
            <p className="text-xs text-zinc-500 text-center">{t.processingHint}</p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <p className="text-red-500 text-sm text-center">{t.error}</p>
            <button
              onClick={handleReset}
              className="w-full border border-zinc-800 rounded-md px-4 py-2 text-sm text-[#ededed] hover:border-white transition-colors"
            >
              {t.reupload}
            </button>
          </div>
        )}

        {status === 'done' && resultUrl && (
          <ResultPlayer url={resultUrl} onReset={handleReset} />
        )}
      </div>
    </main>
  );
}
