"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Search, Folder, FileImage, Copy, CheckCircle, RefreshCw, Trash2 } from "lucide-react";
import Image from "next/image";
import { GlowCard } from "@/components/ui/GlowCard";

export default function MediaLibraryPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [activeFolder, setActiveFolder] = useState("all");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadMedia = () => {
    setLoading(true);
    fetch('/api/media')
      .then(r => r.json())
      .then(d => { setMedia(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { loadMedia(); }, []);

  const folders = ['all', ...Array.from(new Set(media.map(m => m.folder))).sort() as string[]];

  const filtered = media.filter(m => {
    const matchFolder = activeFolder === 'all' || m.folder === activeFolder;
    const matchSearch = !search || m.name?.toLowerCase().includes(search.toLowerCase()) || m.url?.toLowerCase().includes(search.toLowerCase());
    return matchFolder && matchSearch;
  });

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    try {
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', activeFolder === 'all' ? 'uploads' : activeFolder);

        const res = await fetch('/api/media', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Upload failed');
        }
      }
    } catch (err: any) {
      alert(err.message || 'Failed to upload media file(s)');
    } finally {
      setIsUploading(false);
      loadMedia();
    }
  };

  const handleDelete = async (url: string) => {
    if (!confirm('Are you sure you want to delete this asset permanently?')) return;
    try {
      const res = await fetch('/api/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Delete failed');
      }
      loadMedia();
    } catch (err: any) {
      alert(err.message || 'Failed to delete asset');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Media Library</h1>
          <p className="text-slate-400">
            {loading ? 'Scanning assets...' : `${media.length} assets indexed — programs, mentors, blogs & public files`}
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={loadMedia} className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-xl transition-all">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect} multiple />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all shadow-sm disabled:opacity-50"
          >
            {isUploading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Upload className="w-5 h-5" />}
            {isUploading ? 'Uploading...' : 'Upload Media'}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar — Folders */}
        <div className="w-full lg:w-56 space-y-1 shrink-0">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-2">Folders</div>
          {folders.map(folder => (
            <button
              key={folder}
              onClick={() => setActiveFolder(folder)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                activeFolder === folder
                  ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Folder className={`w-4 h-4 shrink-0 ${activeFolder === folder ? 'fill-orange-500/20' : ''}`} />
              <span className="capitalize truncate">{folder}</span>
              <span className="ml-auto text-xs font-bold text-slate-600">
                {folder === 'all' ? media.length : media.filter(m => m.folder === folder).length}
              </span>
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 space-y-5 min-w-0">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by filename, URL, or usage..."
              className="w-full bg-[#151821] border border-slate-800 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-orange-500/50 transition-colors text-sm"
            />
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-square rounded-2xl bg-slate-800/60 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <FileImage className="w-12 h-12 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-400 font-semibold">No assets found</p>
              <p className="text-slate-600 text-sm mt-1">Try a different folder or search term</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(asset => (
                <GlowCard key={asset.id} glowColor="orange" customSize className="group relative aspect-square bg-[#151821] border border-slate-800 p-2 flex flex-col">
                  <div className="relative flex-1 rounded-lg overflow-hidden bg-slate-900 border border-slate-800">
                    {(asset.url?.startsWith('http') || asset.url?.startsWith('/')) ? (
                      <Image
                        src={asset.url}
                        alt={asset.name || 'Asset'}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={() => {}}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600">
                        <FileImage className="w-8 h-8" />
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                      <button
                        onClick={() => handleCopy(asset.url)}
                        className="p-2 rounded-lg bg-white/10 hover:bg-orange-500 text-white transition-colors"
                        title="Copy URL"
                      >
                        {copiedUrl === asset.url ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete(asset.url)}
                        className="p-2 rounded-lg bg-white/10 hover:bg-red-600 text-white transition-colors"
                        title="Delete Asset"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 px-1">
                    <p className="text-xs font-semibold text-slate-200 truncate" title={asset.name}>{asset.name}</p>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-[10px] text-orange-400 font-bold uppercase">{asset.folder}</p>
                      <p className="text-[10px] text-slate-500">{asset.sizeLabel}</p>
                    </div>
                    {asset.source && asset.source !== 'public' && (
                      <p className="text-[9px] text-slate-600 truncate mt-0.5" title={asset.source}>↳ {asset.source}</p>
                    )}
                  </div>
                </GlowCard>
              ))}

              {/* Upload placeholder */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-2xl border-2 border-dashed border-slate-800 hover:border-orange-500/50 hover:bg-orange-500/5 transition-colors flex flex-col items-center justify-center gap-3 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-slate-400">Upload New</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

