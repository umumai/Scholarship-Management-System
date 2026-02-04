import React, { useState } from 'react';
import { Application, Scholarship } from '../types';

type DocumentResubmissionModalProps = {
  isOpen: boolean;
  application: Application | null;
  scholarship: Scholarship | null;
  onClose: () => void;
  onSubmit: (files: File[]) => Promise<void>;
  isLoading?: boolean;
};

const DocumentResubmissionModal: React.FC<DocumentResubmissionModalProps> = ({
  isOpen,
  application,
  scholarship,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  if (!isOpen || !application || !scholarship) return null;

  const requestedDocuments = application.requestedDocuments || [];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadError(null);
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) {
      setUploadError('Please select at least one file to upload');
      return;
    }

    try {
      await onSubmit(selectedFiles);
      setUploadSuccess(true);
      setSelectedFiles([]);
      setTimeout(() => {
        setUploadSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Resubmit Documents</h2>
            <p className="text-sm text-slate-500 mt-1">{scholarship.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors text-2xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Request Details */}
          <div className="bg-red-50 rounded-2xl p-4 border border-red-200">
            <p className="text-sm font-semibold text-red-700 mb-2">Documents Needed:</p>
            <div className="flex flex-wrap gap-2">
              {requestedDocuments.map((doc, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full"
                >
                  {doc}
                </span>
              ))}
            </div>
            {application.documentRequestReason && (
              <p className="text-xs text-red-600 mt-3 italic">
                <strong>Reviewer's Note:</strong> {application.documentRequestReason}
              </p>
            )}
          </div>

          {/* File Upload Area */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-3">
              Upload Files
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="file-input"
                disabled={isLoading}
              />
              <label
                htmlFor="file-input"
                className="flex flex-col items-center cursor-pointer"
              >
                <svg
                  className="w-8 h-8 text-slate-400 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <p className="text-sm font-semibold text-slate-600">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  PDF, PNG, JPG, or DOCX (Max 10MB each)
                </p>
              </label>
            </div>
          </div>

          {/* Selected Files List */}
          {selectedFiles.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-slate-900 mb-3">
                Selected Files ({selectedFiles.length})
              </p>
              <div className="space-y-2">
                {selectedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <svg
                        className="w-5 h-5 text-slate-400 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveFile(idx)}
                      className="ml-2 text-slate-400 hover:text-red-600 transition-colors flex-shrink-0"
                      disabled={isLoading}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {uploadError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm text-red-700 font-medium">⚠ {uploadError}</p>
            </div>
          )}

          {/* Success Message */}
          {uploadSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <p className="text-sm text-emerald-700 font-medium">
                ✓ Documents submitted successfully! Closing...
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2.5 text-slate-700 font-semibold hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || selectedFiles.length === 0}
            className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Submit Documents
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentResubmissionModal;
