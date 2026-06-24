"use client";
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, Image as ImageIcon, Search, Check, FolderOpen } from 'lucide-react';
import FormModal, { Field, Input, Textarea, Select } from '@/components/admin/FormModal';

interface VisualBlock {
  id: string;
  section_key: string;
  title: string;
  subtitle: string;
  description: string;
  image_url: string;
  image_alt: string;
  badge: string;
  cta_text: string;
  cta_link: string;
  position: number;
  visibility: boolean;
  theme_variant: string;
  created_at: string;
}

interface VisualBlockManagerProps {
  sectionKey: string;
  title: string;
  subtitle?: string;
}

const EMPTY_BLOCK = {
  title: '',
  subtitle: '',
  description: '',
  image_url: '',
  image_alt: '',
  badge: '',
  cta_text: '',
  cta_link: '',
  position: 0,
  visibility: true,
  theme_variant: 'glass'
};

export default function VisualBlockManager({ sectionKey, title, subtitle }: VisualBlockManagerProps) {
  const [allBlocks, setAllBlocks] = useState<VisualBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<any>(EMPTY_BLOCK);
  const [uploadingImage, setUploadingImage] = useState(false);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const handleDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', sectionKey);
      
      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Upload failed');
      }
      
      const data = await res.json();
      setForm((p: any) => ({ ...p, image_url: data.url }));
      loadMedia(); // Refresh indexed asset library
    } catch (err: any) {
      alert(err.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };


  // Media Library state
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [showMediaChooser, setShowMediaChooser] = useState(false);
  const [searchMedia, setSearchMedia] = useState('');
  const [activeMediaFolder, setActiveMediaFolder] = useState('all');

  const loadBlocks = async () => {
    setLoading(true);
    try {
      const data = await fetch('/api/visual-blocks', { cache: 'no-store' }).then(r => r.json());
      if (Array.isArray(data)) {
        setAllBlocks(data);
      }
    } catch {}
    setLoading(false);
  };

  const loadMedia = async () => {
    try {
      const data = await fetch('/api/media', { cache: 'no-store' }).then(r => r.json());
      if (Array.isArray(data)) {
        setMediaList(data);
      }
    } catch {}
  };

  useEffect(() => {
    loadBlocks();
    loadMedia();
  }, []);

  const sectionBlocks = allBlocks
    .filter(b => b.section_key === sectionKey)
    .sort((a, b) => a.position - b.position);

  const saveAll = async (updatedList: VisualBlock[]) => {
    try {
      await fetch('/api/visual-blocks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedList)
      });
      loadBlocks();
    } catch {}
  };

  const handleSaveBlock = async () => {
    let list = [...allBlocks];
    if (editingId) {
      list = list.map(b => (b.id === editingId ? { ...b, ...form } : b));
    } else {
      const newBlock: VisualBlock = {
        ...form,
        id: `block-${Date.now()}`,
        section_key: sectionKey,
        position: sectionBlocks.length + 1,
        created_at: new Date().toISOString()
      };
      list.push(newBlock);
    }
    await saveAll(list);
    setModalOpen(false);
    setForm(EMPTY_BLOCK);
    setEditingId(null);
  };

  const handleDeleteBlock = async (id: string) => {
    if (!confirm('Are you sure you want to delete this visual block?')) return;
    const list = allBlocks.filter(b => b.id !== id);
    await saveAll(list);
  };

  const toggleVisibility = async (id: string) => {
    const list = allBlocks.map(b => (b.id === id ? { ...b, visibility: !b.visibility } : b));
    await saveAll(list);
  };

  const movePosition = async (index: number, direction: 'up' | 'down') => {
    const list = [...sectionBlocks];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    // Swap position indices
    const temp = list[index].position;
    list[index].position = list[targetIdx].position;
    list[targetIdx].position = temp;

    // Map swaps back into the main list
    const updatedAll = allBlocks.map(b => {
      const found = list.find(l => l.id === b.id);
      return found ? found : b;
    });

    await saveAll(updatedAll);
  };

  const handleEdit = (block: VisualBlock) => {
    setForm(block);
    setEditingId(block.id);
    setModalOpen(true);
  };

  const openNew = () => {
    setForm({
      ...EMPTY_BLOCK,
      position: sectionBlocks.length + 1
    });
    setEditingId(null);
    setModalOpen(true);
  };

  // Media folders
  const mediaFolders = ['all', ...Array.from(new Set(mediaList.map(m => m.folder))).sort() as string[]];
  const filteredMedia = mediaList.filter(m => {
    const matchSearch = m.name?.toLowerCase().includes(searchMedia.toLowerCase());
    const matchFolder = activeMediaFolder === 'all' || m.folder === activeMediaFolder;
    return matchSearch && matchFolder;
  });

  const f = (field: string) => (e: any) => setForm((p: any) => ({ ...p, [field]: e.target.value }));

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">{title}</h2>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Add Visual Block
        </button>
      </div>

      {loading ? (
        <div className="py-8 text-center text-slate-400 animate-pulse text-sm">Scanning blocks...</div>
      ) : sectionBlocks.length === 0 ? (
        <div className="py-12 border-2 border-dashed border-slate-100 rounded-2xl text-center text-slate-400">
          <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-xs font-semibold">No visual blocks created for this section yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {sectionBlocks.map((block, idx) => (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 hover:border-slate-300 transition-all ${
                  !block.visibility ? 'bg-slate-50 opacity-60' : 'bg-white'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-12 bg-slate-900 rounded-lg overflow-hidden border border-slate-200 shrink-0 flex items-center justify-center relative">
                    {block.image_url ? (
                      <img src={block.image_url} alt={block.title} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-slate-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-slate-800">
                        {block.title || <span className="italic text-slate-400">Untitled Block</span>}
                      </h4>
                      {block.badge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-600">
                          {block.badge}
                        </span>
                      )}
                    </div>
                    {block.description && (
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{block.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-slate-400">Pos: {block.position}</span>
                      <span className="text-[10px] text-slate-400">•</span>
                      <span className="text-[10px] text-slate-400">Theme: {block.theme_variant}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end md:self-auto">
                  {/* Position arrows */}
                  <button
                    disabled={idx === 0}
                    onClick={() => movePosition(idx, 'up')}
                    className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 text-slate-600"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    disabled={idx === sectionBlocks.length - 1}
                    onClick={() => movePosition(idx, 'down')}
                    className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 text-slate-600"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => toggleVisibility(block.id)}
                    className={`p-1.5 rounded-lg hover:bg-slate-100 ${
                      block.visibility ? 'text-slate-600' : 'text-slate-400'
                    }`}
                    title={block.visibility ? 'Hide' : 'Show'}
                  >
                    {block.visibility ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => handleEdit(block)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteBlock(block.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-400"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Editor Modal */}
      {modalOpen && (
        <FormModal
          isOpen={modalOpen}
          title={editingId ? 'Edit Visual Block' : 'Add Visual Block'}
          onClose={() => { setModalOpen(false); setEditingId(null); setForm(EMPTY_BLOCK); }}
          onSubmit={handleSaveBlock}
        >
          <div className="space-y-4">
            <Field label="Block Title" required>
              <Input value={form.title} onChange={f('title')} placeholder="Project-First Learning" />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Subtitle">
                <Input value={form.subtitle} onChange={f('subtitle')} placeholder="Next Milestone" />
              </Field>
              <Field label="Badge / Icon Name">
                <Input value={form.badge} onChange={f('badge')} placeholder="Users / Code2" />
              </Field>
            </div>

            <Field label="Description">
              <Textarea value={form.description} onChange={f('description')} rows={2} placeholder="Explain what this visual represents..." />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="CTA Button Text">
                <Input value={form.cta_text} onChange={f('cta_text')} placeholder="Join Community" />
              </Field>
              <Field label="CTA Destination Link">
                <Input value={form.cta_link} onChange={f('cta_link')} placeholder="/community" />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Theme Style">
                <Select value={form.theme_variant} onChange={f('theme_variant')}>
                  <option value="glass">Glassmorphism Blur</option>
                  <option value="light">Plain Light Card</option>
                  <option value="dark">Cinematic Dark Card</option>
                  <option value="orange">Soft Orange Outline</option>
                  <option value="blue">Soft Blue Outline</option>
                  <option value="purple">Soft Purple Outline</option>
                  <option value="green">Soft Green Outline</option>
                  <option value="orange-bold">Vibrant Orange Fill</option>
                </Select>
              </Field>
              <Field label="Visibility">
                <Select value={form.visibility ? 'true' : 'false'} onChange={e => setForm((p: any) => ({ ...p, visibility: e.target.value === 'true' }))}>
                  <option value="true">Visible</option>
                  <option value="false">Hidden</option>
                </Select>
              </Field>
            </div>

            <Field label="Image URL">
              <div className="flex gap-2 items-center">
                <Input value={form.image_url} onChange={f('image_url')} placeholder="/learning.png" />
                <button
                  type="button"
                  onClick={() => setShowMediaChooser(true)}
                  className="px-3 py-2 bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-bold rounded-xl transition-all whitespace-nowrap"
                >
                  Choose
                </button>
                <input
                  type="file"
                  ref={uploadInputRef}
                  onChange={handleDirectUpload}
                  className="hidden"
                  accept="image/*"
                />
                <button
                  type="button"
                  disabled={uploadingImage}
                  onClick={() => uploadInputRef.current?.click()}
                  className="px-3 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all whitespace-nowrap animate-in fade-in"
                >
                  {uploadingImage ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </Field>


            {form.image_url && (
              <div className="w-full h-32 rounded-xl bg-slate-100 border overflow-hidden relative">
                <img src={form.image_url} alt="Preview" className="w-full h-full object-contain" />
              </div>
            )}
          </div>
        </FormModal>
      )}

      {/* Media Chooser Dialog */}
      {showMediaChooser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-[#0f111a] border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Header */}
            <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-[#151821]">
              <div>
                <h3 className="font-extrabold text-lg text-white">Select Media Asset</h3>
                <p className="text-xs text-slate-400 mt-0.5">Pick from indexed programs, mentors, blogs and files</p>
              </div>
              <button
                type="button"
                onClick={() => setShowMediaChooser(false)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-lg transition-all"
              >
                Close
              </button>
            </div>

            {/* Folder filters & search */}
            <div className="p-4 border-b border-slate-800 bg-[#12141c] space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  value={searchMedia}
                  onChange={e => setSearchMedia(e.target.value)}
                  placeholder="Search assets by name..."
                  className="w-full h-9 bg-slate-900 border border-slate-800 text-white rounded-lg pl-9 pr-4 text-xs focus:outline-none focus:border-orange-500/50"
                />
              </div>

              <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full">
                {mediaFolders.map(folder => (
                  <button
                    key={folder}
                    type="button"
                    onClick={() => setActiveMediaFolder(folder)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase whitespace-nowrap transition-all ${
                      activeMediaFolder === folder
                        ? 'bg-orange-500 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {folder}
                  </button>
                ))}
              </div>
            </div>

            {/* Assets Grid */}
            <div className="flex-1 p-5 overflow-y-auto bg-[#0a0c10] min-h-[300px]">
              {filteredMedia.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  No assets found
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {filteredMedia.map(m => {
                    const isSelected = form.image_url === m.url;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setForm((p: any) => ({ ...p, image_url: m.url }));
                          setShowMediaChooser(false);
                        }}
                        className={`group relative aspect-video bg-[#12141c] border rounded-xl overflow-hidden text-left transition-all ${
                          isSelected ? 'border-orange-500 ring-2 ring-orange-500/40' : 'border-slate-800 hover:border-slate-600'
                        }`}
                      >
                        <img src={m.url} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                          <p className="text-[9px] text-slate-300 font-bold truncate">{m.name}</p>
                          <p className="text-[8px] text-slate-500 font-medium truncate uppercase">{m.folder}</p>
                        </div>
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
