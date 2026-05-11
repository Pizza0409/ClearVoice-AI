'use client';

import { useCallback, useRef, useState } from 'react';

import { useLanguage } from '../language-provider';

const MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

interface DropzoneProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function Dropzone({ onFileSelected, disabled }: DropzoneProps) {
  const { t } = useLanguage();
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.name.toLowerCase().endsWith('.mp4')) return;
      if (file.size > MAX_SIZE_BYTES) {
        setSizeError(true);
        setSelectedFile(null);
        return;
      }
      setSizeError(false);
      setSelectedFile(file);
      onFileSelected(file);
    },
    [onFileSelected],
  );

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragActive(true);
  };

  const onDragLeave = () => setIsDragActive(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onClick = () => {
    if (!disabled) inputRef.current?.click();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-disabled={disabled}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={[
        'border border-dashed rounded-lg p-12 text-center transition-colors duration-150 select-none',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        isDragActive ? 'border-white' : 'border-zinc-800 hover:border-white',
      ].join(' ')}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".mp4,video/mp4"
        className="hidden"
        onChange={onInputChange}
        disabled={disabled}
      />

      {selectedFile ? (
        <div className="space-y-1">
          <p className="text-sm font-medium text-[#ededed]">{selectedFile.name}</p>
          <p className="text-xs text-zinc-500">{formatBytes(selectedFile.size)}</p>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-zinc-400">
            {t.dropzoneLead}
            <span className="text-[#ededed]">{t.dropzoneMp4}</span>
            {t.dropzoneTrail}
          </p>
          <p className="text-xs text-zinc-600">{t.dropzoneFootnote}</p>
        </div>
      )}

      {sizeError && (
        <p className="mt-3 text-xs text-red-500">{t.dropzoneTooLarge}</p>
      )}
    </div>
  );
}
