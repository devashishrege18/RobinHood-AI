/**
 * FileUpload — Contract/document upload with file preview.
 */

import { useRef, useState } from 'react';

const ACCEPTED_TYPES = '.pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.webp';
const MAX_SIZE_MB = 10;

export default function FileUpload({ onFileSelect, disabled = false }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleClick = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleChange = (e) => {
    setError('');
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File too large. Maximum ${MAX_SIZE_MB}MB allowed.`);
      return;
    }

    setFile(selected);

    // Read as base64
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      if (onFileSelect) {
        onFileSelect({
          name: selected.name,
          size: selected.size,
          type: selected.type,
          base64,
        });
      }
    };
    reader.readAsDataURL(selected);
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setFile(null);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
    if (onFileSelect) onFileSelect(null);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full max-w-xs mx-auto">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES}
        onChange={handleChange}
        className="hidden"
        id="file-upload-input"
      />

      {!file ? (
        <button
          onClick={handleClick}
          disabled={disabled}
          className="w-full py-3 px-5 rounded-xl border-2 border-dashed border-slate-300 
                     text-slate-600 text-sm font-medium
                     hover:border-robin-500 hover:text-robin-700 hover:bg-robin-50/30
                     transition-all duration-150
                     disabled:opacity-50 disabled:cursor-not-allowed"
          id="upload-contract-button"
        >
          <div className="flex items-center justify-center space-x-2">
            <UploadIcon className="w-4 h-4" />
            <span>Upload Contract</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">PDF, Image or Document</p>
        </button>
      ) : (
        <div className="flex items-center space-x-3 p-3 bg-robin-50 border border-robin-200 rounded-xl animate-fade-in">
          <FileIcon className="w-5 h-5 text-robin-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">{file.name}</p>
            <p className="text-xs text-slate-500">{formatSize(file.size)}</p>
          </div>
          <button
            onClick={clearFile}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
            aria-label="Remove file"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 mt-2 text-center">{error}</p>
      )}
    </div>
  );
}


function UploadIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function FileIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function CloseIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
