"use client";
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Star } from 'lucide-react';
import FormModal, { Field, Input, Textarea } from '@/components/admin/FormModal';
import ImagePicker from '@/components/admin/ImagePicker';
import { testimonials as staticTestimonials } from '@/data/testimonials';

export default function AdminTestimonials() {
  const [items, setItems] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ id: '', name: '', role: '', company: '', avatar: '', content: '', program: '' });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const res = await fetch('/api/testimonials', { cache: 'no-store' });
      const dynamic = await res.json();
      const raw = dynamic.success && Array.isArray(dynamic.data) ? dynamic.data : (Array.isArray(dynamic) ? dynamic : []);
      
      // Merge static + dynamic
      const all = [
        ...staticTestimonials.map(t => ({ ...t, source: 'static' })),
        ...raw.map((t: any) => ({ ...t, source: 'dynamic' }))
      ];
      setItems(all);
    } catch {
      setItems(staticTestimonials.map(t => ({ ...t, source: 'static' })));
    }
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm({ id: '', name: '', role: '', company: '', avatar: '', content: '', program: '' }); setEditing(null); setModalOpen(true); };
  const openEdit = (t: any) => { setForm(t); setEditing(t); setModalOpen(true); };
  const f = (field: string) => (e: any) => setForm((prev: any) => ({ ...prev, [field]: e.target.value }));

  const handleSave = async () => {
    setLoading(true);
    await fetch('/api/testimonials', { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setModalOpen(false); setLoading(false); load();
  };

  const handleDelete = async (id: string, source: string) => {
    if (source === 'static') { alert('Static testimonials are in code. Edit src/data/testimonials.ts directly.'); return; }
    if (!confirm('Delete this testimonial?')) return;
    await fetch('/api/testimonials', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    load();
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Testimonials</h1>
          <p className="text-slate-500 mt-1">{items.length} student reviews</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all">
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {items.map(item => (
            <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 group"
            >
              <div className="flex items-center gap-3 mb-3">
                {item.avatar && <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full object-cover bg-slate-100" onError={e => { (e.target as HTMLImageElement).src = '/logo/devphoenix-logo.png'; }} />}
                <div>
                  <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.role}{item.company ? ` @ ${item.company}` : ''}</p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-2">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-orange-400 text-orange-400" />)}
              </div>
              <p className="text-sm text-slate-600 italic line-clamp-3">"{item.content}"</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">{item.program}</span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(item)} className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-orange-50 flex items-center justify-center transition-colors">
                    <Edit2 className="w-3 h-3 text-slate-600" />
                  </button>
                  <button onClick={() => handleDelete(item.id, item.source)} className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-red-50 flex items-center justify-center transition-colors">
                    <Trash2 className="w-3 h-3 text-red-400" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <FormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Testimonial' : 'Add Testimonial'} onSubmit={handleSave} loading={loading}>
        <Field label="Student Name" required><Input value={form.name} onChange={f('name')} placeholder="Arjun Desai" /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Role"><Input value={form.role} onChange={f('role')} placeholder="Backend Developer" /></Field>
          <Field label="Company"><Input value={form.company} onChange={f('company')} placeholder="TCS" /></Field>
        </div>
        <Field label="Program"><Input value={form.program} onChange={f('program')} placeholder="Full Stack Development" /></Field>
        <Field label="Testimonial" required><Textarea value={form.content} onChange={f('content')} rows={4} placeholder="What the student said about their experience..." /></Field>
        <ImagePicker value={form.avatar} onChange={url => setForm(p => ({ ...p, avatar: url }))} label="Student Photo URL" />
      </FormModal>
    </div>
  );
}
