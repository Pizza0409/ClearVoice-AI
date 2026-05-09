'use client';

interface ResultPlayerProps {
  url: string;
  onReset: () => void;
}

export default function ResultPlayer({ url, onReset }: ResultPlayerProps) {
  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = url;
    a.download = 'denoised.mp4';
    a.click();
  };

  return (
    <div className="space-y-4">
      <video
        src={url}
        controls
        className="w-full rounded-lg border border-zinc-800"
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleDownload}
          className="flex-1 bg-white text-black rounded-md px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
        >
          下載降噪後影片
        </button>

        <button
          onClick={onReset}
          className="flex-1 border border-zinc-800 rounded-md px-4 py-2 text-sm text-[#ededed] hover:border-white transition-colors"
        >
          重新上傳
        </button>
      </div>
    </div>
  );
}
