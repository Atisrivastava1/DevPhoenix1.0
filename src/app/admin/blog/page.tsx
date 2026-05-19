"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, PenSquare } from 'lucide-react';
import FormModal, { Field } from '@/components/admin/FormModal';
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input, Textarea, Select } from "@/components/ui/FormElements";
import { PremiumEmptyState } from "@/components/ui/PremiumEmptyState";
import { designSystem } from "@/lib/design-system";
import ImagePicker from '@/components/admin/ImagePicker';
import { showToast } from '@/components/ui/PremiumToast';
import { ConfirmDeleteModal } from '@/components/admin/ConfirmDeleteModal';


const EMPTY = { id: '', slug: '', title: '', excerpt: '', category: 'AI & Automation', read_time: '5 min read', published_at: '', cover_image: '', content: '', is_published: true, author: { name: 'DevPhoeniX Team', role: 'Engineering', avatar: '/logo/devphoenix-logo.png' } };

export default function AdminBlog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const load = () => fetch('/api/blog', { cache: 'no-store' })
    .then(r => r.json())
    .then(d => {
      // Unwrap standard envelope { success: true, data: [...] }
      const items = d.success && Array.isArray(d.data) ? d.data : (Array.isArray(d) ? d : []);
      setPosts(items);
    })
    .catch(() => {});

  useEffect(() => { load(); }, []);

  const openNew = () => { setForm({ ...EMPTY, published_at: new Date().toISOString() }); setEditing(null); setModalOpen(true); };
  const openEdit = (p: any) => { setForm(p); setEditing(p); setModalOpen(true); };
  const f = (field: string) => (e: any) => setForm((prev: any) => ({ ...prev, [field]: e.target.value }));

  const handleSave = async () => {
    if (!form.title?.trim()) {
      showToast('Article title is required!', 'error');
      return;
    }
    if (!form.content?.trim()) {
      showToast('Article content is required!', 'error');
      return;
    }
    setLoading(true);

    const rawSlug = form.slug || form.title;
    const slug = String(rawSlug)
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-');

    const payload = { ...form, slug };
    try {
      const res = await fetch('/api/blog', { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || data.error || 'Failed to save article.');
      }
      showToast(`Article "${form.title}" published/saved successfully!`, 'success');
      setModalOpen(false);
      load();
    } catch (err: any) {
      showToast(err.message || 'Failed to save article.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setConfirmDeleteId(id);
  };

  const executeDelete = async () => {
    if (!confirmDeleteId) return;
    const id = confirmDeleteId;
    setConfirmDeleteId(null);

    const original = [...posts];
    setPosts(prev => prev.filter(p => p.id !== id));
    showToast('Article deleted successfully', 'success');

    try {
      const res = await fetch('/api/blog', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      if (!res.ok) throw new Error();
      load();
    } catch {
      setPosts(original);
      showToast('Error deleting article, restored.', 'error');
    }
  };

  return (
    <div className={`${designSystem.spacing.containerMaxWidth} py-8`}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Blog</h1>
          <p className="text-sm text-slate-500 mt-1">{posts.length} articles published</p>
        </div>
        <Button onClick={openNew} icon={<Plus className="w-4 h-4" />}>
          New Article
        </Button>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {posts.map(post => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Card variant="glass" padding="sm" className="flex items-center gap-4 group border border-slate-100/50">
                {post.cover_image && (
                  <div className="relative w-20 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-50 border border-slate-100">
                    <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge variant="orange">{post.category}</Badge>
                    <span className="text-xs text-slate-400 font-medium">{post.read_time}</span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 truncate leading-snug">{post.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 leading-relaxed">{post.excerpt}</p>
                </div>
                <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(post)}
                    className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-orange-50 flex items-center justify-center transition-colors"
                    title="Edit Article"
                  >
                    <Edit2 className="w-4 h-4 text-slate-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-red-50 flex items-center justify-center transition-colors"
                    title="Delete Article"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {posts.length === 0 && (
        <PremiumEmptyState
          title="No Articles Written"
          description="Click 'New Article' to compose and publish your first industry post."
          icon={PenSquare}
        />
      )}

      <FormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Article' : 'New Article'} onSubmit={handleSave} loading={loading} submitLabel="Publish">
        <Field label="Title" required><Input value={form.title} onChange={f('title')} placeholder="Building AI Agents with n8n..." /></Field>
        <Field label="Slug (URL)"><Input value={form.slug} onChange={f('slug')} placeholder="building-ai-agents-n8n" /></Field>
        <Field label="Excerpt"><Textarea value={form.excerpt} onChange={f('excerpt')} rows={2} placeholder="A short summary shown on the blog listing page..." /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Category"><Select value={form.category} onChange={f('category')}><option>AI & Automation</option><option>Builder Journey</option><option>Cloud & DevOps</option><option>Data Science</option><option>Career</option></Select></Field>
          <Field label="Read Time"><Input value={form.read_time} onChange={f('read_time')} placeholder="8 min read" /></Field>
        </div>
        <ImagePicker value={form.cover_image} onChange={url => setForm((p: any) => ({ ...p, cover_image: url }))} label="Cover Image" />
        <Field label="Content (HTML)" required>
          <Textarea value={form.content} onChange={f('content')} rows={10} placeholder="<h2>Introduction</h2><p>Your article content here...</p>" className="font-mono text-xs" />
        </Field>
      </FormModal>

      <ConfirmDeleteModal
        isOpen={confirmDeleteId !== null}
        title="Delete Article"
        message="Are you sure you want to permanently delete this article? This action cannot be undone."
        onConfirm={executeDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}
