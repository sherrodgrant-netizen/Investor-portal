"use client";

import { useState, useRef } from "react";

interface WireUploaderProps {
  onUploaded: (imageDataUrl: string) => void;
}

export default function WireUploader({ onUploaded }: WireUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    const allowed = ["image/png", "image/jpeg", "image/webp", "image/gif", "application/pdf"];
    if (!allowed.includes(f.type)) {
      setError("Please upload a PNG, JPEG, WebP, GIF, or PDF file.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("File is too large. Maximum size is 10MB.");
      return;
    }

    setFile(f);
    setError(null);
    setSubmitted(false);

    if (f.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const submit = () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setSubmitted(true);
      onUploaded(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setSubmitted(false);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900">Wire Transfer Confirmation</h3>
      <p className="text-sm text-gray-500">
        Upload a screenshot or PDF of your wire transfer confirmation. Our team will verify it.
      </p>

      {/* Upload Area */}
      {!file && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-black bg-gray-50"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,application/pdf"
            onChange={handleInputChange}
            className="hidden"
          />
          <svg className="w-10 h-10 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-sm font-medium text-gray-700">
            Drag & drop your wire confirmation here
          </p>
          <p className="text-xs text-gray-500 mt-1">or click to browse (PNG, JPEG, PDF, up to 10MB)</p>
        </div>
      )}

      {/* Preview */}
      {file && (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(0)} KB</p>
              </div>
            </div>
            {!submitted && (
              <button onClick={reset} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {preview && (
            <img
              src={preview}
              alt="Wire confirmation preview"
              className="w-full rounded-lg border border-gray-200 mb-3 max-h-48 object-contain bg-white"
            />
          )}

          {/* Submit Button */}
          {!submitted && (
            <button
              onClick={submit}
              className="w-full bg-black text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Submit Wire Confirmation
            </button>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-red-800">{error}</p>
            <button onClick={reset} className="text-xs text-red-600 underline mt-1">
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Submitted Confirmation */}
      {submitted && (
        <div className="p-4 rounded-xl border bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-semibold text-sm text-blue-800">Wire Confirmation Uploaded</p>
              <p className="text-xs text-gray-600 mt-1">Our team will review and verify your wire transfer.</p>
              <button
                onClick={reset}
                className="mt-2 text-xs font-medium underline text-gray-600 hover:text-gray-900"
              >
                Upload a different file
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
