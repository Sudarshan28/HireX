import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, CheckCircle, AlertCircle, Eye, RefreshCw, Trash2, X } from 'lucide-react';
import api from '../api/axios';

const ResumeUpload = ({ resumeUrl, onUploadSuccess, onDeleteSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isReplacing, setIsReplacing] = useState(false);

  const onDrop = async (acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    if (!uploadedFile) return;

    if (uploadedFile.type !== 'application/pdf') {
      setError('Please upload a PDF file only.');
      return;
    }

    setFile(uploadedFile);
    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('resume', uploadedFile);

    try {
      const res = await api.post('/student/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        setIsReplacing(false);
        if (onUploadSuccess) {
          onUploadSuccess(res.data.data);
        }
      } else {
        setError(res.data.message || 'Failed to upload resume.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error uploading file.');
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    multiple: false,
    disabled: loading,
  });

  const getUploadDate = () => {
    if (!resumeUrl) return null;
    const filename = resumeUrl.split('/').pop();
    const match = filename.match(/resume-(\d+)\./i);
    if (match && match[1]) {
      const timestamp = parseInt(match[1]);
      return new Date(timestamp).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return null;
  };

  const viewResume = () => {
    if (!resumeUrl) return;
    const baseUrl = api.defaults.baseURL.replace('/api', '');
    window.open(`${baseUrl}${resumeUrl}`, '_blank');
  };

  const handleReplace = () => {
    setIsReplacing(true);
  };

  const handleCancelReplace = () => {
    setIsReplacing(false);
    setError('');
  };

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.delete('/student/resume');
      if (res.data.success) {
        setFile(null);
        setIsReplacing(false);
        if (onDeleteSuccess) {
          onDeleteSuccess(res.data.data);
        }
      } else {
        setError(res.data.message || 'Failed to delete resume.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error deleting resume.');
    } finally {
      setLoading(false);
    }
  };

  const filename = resumeUrl ? resumeUrl.split('/').pop() : '';
  const uploadDate = getUploadDate();

  // Show uploaded resume card
  if (resumeUrl && !isReplacing) {
    return (
      <div className="w-full space-y-6">
        {/* Resume Uploaded Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700 w-fit">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>✓ Resume Uploaded</span>
        </div>

        {/* Resume File Display */}
        <div className="flex items-start gap-3 text-gray-700 py-1">
          <FileText className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-gray-900 truncate">
              {filename}
            </span>
            {uploadDate && (
              <span className="text-xs text-gray-500">
                Uploaded: {uploadDate}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={viewResume}
            type="button"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#202A36] hover:bg-[#1a2229] disabled:opacity-50 text-white rounded-lg text-sm font-display font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            <Eye className="w-4 h-4" />
            View Resume
          </button>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={handleReplace}
              type="button"
              disabled={loading}
              className="flex-1 min-w-0 w-full py-3 px-3 bg-white hover:bg-gray-50 disabled:opacity-50 text-gray-700 rounded-lg text-sm font-display font-bold transition-all border border-gray-300 flex items-center justify-center gap-1.5 shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Replace
            </button>
            
            <button
              onClick={handleDelete}
              type="button"
              disabled={loading}
              className="flex-1 min-w-0 w-full py-3 px-3 bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-600 rounded-lg text-sm font-display font-bold transition-all border border-red-200 flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs text-[#ff4444] bg-[#ff4444]/10 p-3 rounded border border-[#ff4444]/20">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }

  // Show dropzone upload component
  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-emerald-500 bg-emerald-50/50'
            : 'border-gray-300 hover:border-gray-400 bg-gray-50'
        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-[#202A36] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-display text-gray-700">
              AI is analyzing your resume...
            </p>
            {file && (
              <span className="text-xs font-mono text-gray-500">{file.name}</span>
            )}
          </div>
        ) : file && !error ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <CheckCircle className="w-12 h-12 text-emerald-600 animate-bounce" />
            <p className="text-sm font-display text-gray-900 font-bold">
              Resume uploaded successfully!
            </p>
            <span className="text-xs font-mono text-gray-600 flex items-center gap-1.5 bg-gray-150 px-3 py-1.5 rounded border border-gray-200">
              <FileText className="w-4 h-4 text-emerald-600" />
              {file.name}
            </span>
            <p className="text-xs text-gray-500">Drag or click to replace file</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500">
              <UploadCloud className="w-6 h-6 text-[#202A36]" />
            </div>
            <div>
              <p className="text-sm font-display font-semibold text-gray-700">
                Drop your PDF resume here or click to browse
              </p>
              <p className="text-xs text-gray-500 mt-1">
                File size limit note (max 5MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {isReplacing && !loading && (
        <button
          onClick={handleCancelReplace}
          type="button"
          className="mt-3 w-full py-2 px-4 bg-gray-800 hover:bg-gray-750 text-gray-300 rounded text-xs font-display font-semibold transition-all border border-gray-700 flex items-center justify-center gap-1.5"
        >
          <X className="w-3.5 h-3.5" />
          Cancel Replace
        </button>
      )}

      {error && (
        <div className="mt-4 flex items-center gap-2 text-xs text-[#ff4444] bg-[#ff4444]/10 p-3 rounded border border-[#ff4444]/20">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
