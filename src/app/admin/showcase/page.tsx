"use client";

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search, Layers, ExternalLink, Inbox } from 'lucide-react';
import FormModal, { Field, Input, Textarea } from '@/components/admin/FormModal';
import VisualBlockManager from '@/components/admin/VisualBlockManager';

const EMPTY = { title: '', description: '', category: '', image: '', live_url: '', github_url: '', tags: '', student: '' };

export default function AdminShowcasePage() {
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/showcase', { cache: 'no-store' });
      const d = await res.json();
      const data = d.success && Array.isArray(d.data) ? d.data : (Array.isArray(d) ? d : []);
      setItems(data);
    } catch {
      setItems([]);
    }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const f = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [field]: e.target.value }));

  const handleSave = async () => {
    const payload = { ...form, tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean) };
    if (editing) {
      await fetch('/api/showcase', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editing, ...payload }) });
    } else {
      await fetch('/api/showcase', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    }
    setModal(false); setForm(EMPTY); setEditing(null); load();
  };

  const handleEdit = (item: any) => {
    setForm({ ...item, tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || '' });
    setEditing(item.id); setModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this showcase item?')) return;
    await fetch('/api/showcase', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    load();
  };

  const filtered = items.filter(i => !search || i.title?.toLowerCase().includes(search.toLowerCase()) || i.student?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Showcase</h1>
          <p className="text-slate-400">{items.length} student projects</p>
        </div>
        <button onClick={() => { setForm(EMPTY); setEditing(null); setModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors">
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..." className="w-full bg-[#151821] border border-slate-800 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-orange-500/50" />
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#151821] border border-slate-800 rounded-2xl p-12 text-center">
          <Inbox className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-400 font-semibold">No showcase projects yet</p>
          <button onClick={() => { setForm(EMPTY); setEditing(null); setModal(true); }} className="mt-4 px-4 py-2 bg-orange-500 text-white text-sm font-bold rounded-xl hover:bg-orange-600 transition-colors">Add First Project</button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(item => (
            <div key={item.id} className="bg-[#151821] border border-slate-800 rounded-2xl p-5 hover:border-slate-600 transition-all group">
              {item.image && (
                <div className="w-full aspect-video rounded-xl overflow-hidden bg-slate-900 mb-4">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <p className="text-xs text-orange-400 font-bold uppercase tracking-wider mb-1">{item.category}</p>
              <h3 className="font-bold text-white mb-1 truncate">{item.title}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 mb-3">{item.description}</p>
              {item.student && <p className="text-xs text-slate-600 mb-3">by {item.student}</p>}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {(Array.isArray(item.tags) ? item.tags : []).slice(0, 3).map((t: string) => (
                  <span key={t} className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleEdit(item)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors">
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                {item.live_url && (
                  <a href={item.live_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-slate-800 hover:bg-orange-500/10 text-slate-400 hover:text-orange-400 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <button onClick={() => handleDelete(item.id)} className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}


      {modal && (
        <FormModal title={editing ? 'Edit Project' : 'Add Showcase Project'} onClose={() => { setModal(false); setEditing(null); setForm(EMPTY); }} isOpen={modal} onSubmit={handleSave}>
          <Field label="Project Title" required><Input value={form.title} onChange={f('title')} placeholder="Full Stack SaaS MVP" /></Field>
          <Field label="Description"><Textarea value={form.description} onChange={f('description')} rows={2} placeholder="Brief project description..." /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Category"><Input value={form.category} onChange={f('category')} placeholder="Full Stack" /></Field>
            <Field label="Student Name"><Input value={form.student} onChange={f('student')} placeholder="Arjun Desai" /></Field>
          </div>
          <Field label="Cover Image URL"><Input value={form.image} onChange={f('image')} placeholder="https://..." /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Live URL"><Input value={form.live_url} onChange={f('live_url')} placeholder="https://..." /></Field>
            <Field label="GitHub URL"><Input value={form.github_url} onChange={f('github_url')} placeholder="https://github.com/..." /></Field>
          </div>
          <Field label="Tech Tags (comma-separated)"><Input value={form.tags} onChange={f('tags')} placeholder="React, Node.js, AWS" /></Field>
        </FormModal>
      )}

      <div className="mt-8">
        <VisualBlockManager
          sectionKey="showcase"
          title="Showcase Graphic Illustrations & Visual Blocks CMS"
          subtitle="Manage landing card graphics, banners, and layout vectors displayed to students."
        />
      </div>
    </div>
  );
}

