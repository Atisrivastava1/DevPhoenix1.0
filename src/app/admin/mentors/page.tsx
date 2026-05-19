"use client";
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Users } from 'lucide-react';
import FormModal, { Field, Input, Select } from '@/components/admin/FormModal';
import ImagePicker from '@/components/admin/ImagePicker';

const EMPTY = { id: '', name: '', role: '', status: 'online', avatar: '', tags: '', is_verified: true, followers: 0 };

export default function AdminMentors() {
  const [mentors, setMentors] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [loading, setLoading] = useState(false);

  const load = () => fetch('/api/mentors', { cache: 'no-store' }).then(r => r.json()).then(d => {
    const list = d.success && Array.isArray(d.data) ? d.data : (Array.isArray(d) ? d : []);
    setMentors(list);
  }).catch(() => {});

  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(EMPTY); setEditing(null); setModalOpen(true); };
  const openEdit = (m: any) => { setForm({ ...m, tags: Array.isArray(m.tags) ? m.tags.join(', ') : m.tags || '' }); setEditing(m); setModalOpen(true); };
  const f = (field: string) => (e: any) => setForm((prev: any) => ({ ...prev, [field]: e.target.value }));

  const handleSave = async () => {
    setLoading(true);
    const payload = { 
      ...form, 
      tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean), 
      followers: Number(form.followers), 
      is_verified: Boolean(form.is_verified || form.isVerified) 
    };
    await fetch('/api/mentors', { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setModalOpen(false); setLoading(false); load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this mentor?')) return;
    await fetch('/api/mentors', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    load();
  };

  const statusColor = (s: string) => s === 'online' ? 'bg-green-500' : s === 'away' ? 'bg-amber-500' : 'bg-slate-400';

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Mentors</h1>
          <p className="text-slate-500 mt-1">{mentors.length} active mentors</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all">
          <Plus className="w-4 h-4" /> Add Mentor
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence>
          {mentors.map(mentor => (
            <motion.div key={mentor.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center group"
            >
              <div className="relative w-16 h-16 rounded-full mx-auto mb-3 bg-slate-100 overflow-hidden">
                {mentor.avatar && <img src={mentor.avatar} alt={mentor.name} className="w-full h-full object-cover" />}
                <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${statusColor(mentor.status)}`} />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">{mentor.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5 mb-2">{mentor.role}</p>
              <p className="text-xs font-bold text-orange-600">{(mentor.followers || 0).toLocaleString()} students</p>
              <div className="flex gap-2 justify-center mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(mentor)} className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-orange-50 text-xs font-bold text-slate-600 transition-colors flex items-center gap-1">
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
                <button onClick={() => handleDelete(mentor.id)} className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-red-50 text-xs font-bold text-red-400 transition-colors flex items-center gap-1">
                  <Trash2 className="w-3 h-3" /> Remove
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {mentors.length === 0 && (
          <div className="col-span-4 py-16 text-center text-slate-400">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No mentors yet.</p>
          </div>
        )}
      </div>

      <FormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Mentor' : 'Add Mentor'} onSubmit={handleSave} loading={loading}>
        <Field label="Full Name" required><Input value={form.name} onChange={f('name')} placeholder="Vikram Mehta" /></Field>
        <Field label="Role & Company"><Input value={form.role} onChange={f('role')} placeholder="Senior SDE @ Amazon" /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Status"><Select value={form.status} onChange={f('status')}><option value="online">Online</option><option value="away">Away</option><option value="offline">Offline</option></Select></Field>
          <Field label="Students Mentored"><Input type="number" value={form.followers} onChange={f('followers')} /></Field>
        </div>
        <Field label="Specialties (comma-separated)"><Input value={form.tags} onChange={f('tags')} placeholder="AWS, System Design, Python" /></Field>
        <ImagePicker value={form.avatar} onChange={url => setForm((p: any) => ({ ...p, avatar: url }))} label="Profile Photo URL" />
      </FormModal>
    </div>
  );
}
