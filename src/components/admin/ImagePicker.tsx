"use client";
import { useState } from 'react';
import Image from 'next/image';
import { ImageIcon, Link2, X, Upload } from 'lucide-react';

interface ImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImagePicker({ value, onChange, label = 'Image' }: ImagePickerProps) {
  const [tab, setTab] = useState<'url' | 'preview'>('url');
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'shared-uploads');

      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      
      onChange(data.url);
      setTab('preview');
    } catch (err) {
      console.error('Image upload error:', err);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-bold text-slate-700">{label}</label>

      <div className="flex gap-2">
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
          {(['url', 'preview'] as const).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                tab === t ? 'bg-[#6366F1] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t === 'url' ? <Link2 className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
              {t === 'url' ? 'Enter URL' : 'Preview'}
            </button>
          ))}
        </div>
        
        <label className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm border ${
          uploading ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
        }`}>
          <Upload className="w-3 h-3" />
          {uploading ? 'Uploading...' : 'Upload Image'}
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      {tab === 'url' && (
        <div className="flex gap-2">
          <input
            type="url"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="flex-1 h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          />
          {value && (
            <button onClick={() => onChange('')} className="w-10 h-10 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {tab === 'preview' && (
        <div className="relative w-full h-40 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 overflow-hidden">
          {value ? (
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-400">
              <ImageIcon className="w-8 h-8" />
              <p className="text-xs font-medium">No image URL entered yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
