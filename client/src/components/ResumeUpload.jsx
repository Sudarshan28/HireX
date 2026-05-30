import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../api/axios';

const ResumeUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-[#00ff88] bg-[rgba(0,255,136,0.05)]'
            : 'border-[rgba(59,75,61,0.5)] hover:border-[#00ff88]/50 bg-[rgba(24,34,26,0.2)]'
        }`}
      >
        <input {...getInputProps()} />
        
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-[#00ff88] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-display text-[#dae6d8]">
              AI is analyzing your resume...
            </p>
            {file && (
              <span className="text-xs font-mono text-[#b9cbb9]">{file.name}</span>
            )}
          </div>
        ) : file && !error ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <CheckCircle className="w-12 h-12 text-[#00ff88] animate-bounce" />
            <p className="text-sm font-display text-[#dae6d8] font-bold">
              Resume uploaded successfully!
            </p>
            <span className="text-xs font-mono text-[#b9cbb9] flex items-center gap-1.5 bg-[rgba(24,34,26,0.6)] px-3 py-1.5 rounded border border-[rgba(59,75,61,0.3)]">
              <FileText className="w-4 h-4 text-[#00ff88]" />
              {file.name}
            </span>
            <p className="text-xs text-[#b9cbb9]">Drag or click to replace file</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[rgba(24,34,26,0.8)] border border-[rgba(59,75,61,0.4)] flex items-center justify-center text-[#00ff88]">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-display font-semibold text-[#dae6d8]">
                Drop your PDF resume here or click to browse
              </p>
              <p className="text-xs text-[#b9cbb9] mt-1">
                File size limit note (max 5MB)
              </p>
            </div>
          </div>
        )}
      </div>

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
