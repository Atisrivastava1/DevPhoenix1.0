"use client";
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, GraduationCap, ChevronDown, ChevronUp, BookOpen, HelpCircle, DollarSign, ExternalLink } from 'lucide-react';
import FormModal, { Field } from '@/components/admin/FormModal';
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input, Textarea, Select } from "@/components/ui/FormElements";
import { PremiumEmptyState } from "@/components/ui/PremiumEmptyState";
import { designSystem } from "@/lib/design-system";
import ImagePicker from '@/components/admin/ImagePicker';
import VisualBlockManager from '@/components/admin/VisualBlockManager';
import Link from 'next/link';
import { showToast } from '@/components/ui/PremiumToast';
import { ConfirmDeleteModal } from '@/components/admin/ConfirmDeleteModal';


const EMPTY_MODULE = { week: '', title: '', topics: '' };
const EMPTY_FAQ = { question: '', answer: '' };

const EMPTY = {
  id: '', title: '', description: '', overview: '', category: 'Development', level: 'Beginner',
  duration: '4-6 Months', type: 'Premium', price: '', practical_hours: '100+ Hours',
  tags: '', image: '', outcomes: '', projects: 10,
  // rich fields
  curriculum: [] as any[], faqs: [] as any[],
  originalPrice: '', discountedPrice: '', emi: '', includes: '',
};

type TabKey = 'basic' | 'curriculum' | 'faqs' | 'pricing';

export default function AdminPrograms() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('basic');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // ── curriculum editing state ──
  const [newModule, setNewModule] = useState(EMPTY_MODULE);
  const [newFaq, setNewFaq] = useState(EMPTY_FAQ);

  const load = () => fetch('/api/programs', { cache: 'no-store' })
    .then(r => r.json())
    .then(d => {
      const items = d.success && Array.isArray(d.data) ? d.data : (Array.isArray(d) ? d : []);
      setPrograms(items);
    })
    .catch(() => {});

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setForm({ ...EMPTY, curriculum: [], faqs: [] });
    setEditing(null);
    setActiveTab('basic');
    setModalOpen(true);
  };
  const openEdit = (p: any) => {
    setForm({
      ...p,
      tags: Array.isArray(p.tags) ? p.tags.join(', ') : p.tags || '',
      outcomes: Array.isArray(p.outcomes) ? p.outcomes.join('\n') : p.outcomes || '',
      curriculum: p.curriculum || [],
      faqs: p.faqs || [],
      originalPrice: p.pricing_details?.originalPrice || '',
      discountedPrice: p.pricing_details?.discountedPrice || p.price || '',
      emi: p.pricing_details?.emi || '',
      includes: Array.isArray(p.pricing_details?.includes) ? p.pricing_details.includes.join('\n') : '',
    });
    setEditing(p);
    setActiveTab('basic');
    setModalOpen(true);
  };

  const handleSave = async () => {
    // 1. Strict UI Form Field Validation
    if (!form.title?.trim()) {
      showToast('Program title is required!', 'error');
      return;
    }
    if (!form.description?.trim()) {
      showToast('Short description is required!', 'error');
      return;
    }
    if (!form.category?.trim()) {
      showToast('Program category is required!', 'error');
      return;
    }
    if (!form.level?.trim()) {
      showToast('Difficulty level is required!', 'error');
      return;
    }
    if (!form.duration?.trim()) {
      showToast('Program duration is required!', 'error');
      return;
    }
    if (!form.type?.trim()) {
      showToast('Program type is required!', 'error');
      return;
    }
    if (!form.price?.trim()) {
      showToast('Display price is required!', 'error');
      return;
    }
    if (!form.practical_hours?.trim()) {
      showToast('Practical hours count is required!', 'error');
      return;
    }
    if (!form.image?.trim()) {
      showToast('Program cover image is required!', 'error');
      return;
    }

    setLoading(true);
    
    // Auto-clean & format slug safely
    const rawSlug = form.slug || form.title;
    const slug = String(rawSlug)
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-');

    const payload = {
      ...form,
      slug,
      tags: typeof form.tags === 'string' ? form.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : form.tags,
      outcomes: typeof form.outcomes === 'string' ? form.outcomes.split('\n').filter(Boolean) : form.outcomes,
      projects: Number(form.projects),
      curriculum: form.curriculum || [],
      faqs: form.faqs || [],
      pricing_details: {
        originalPrice: form.originalPrice,
        discountedPrice: form.discountedPrice || form.price,
        emi: form.emi || null,
        includes: typeof form.includes === 'string' ? form.includes.split('\n').filter(Boolean) : (form.includes || []),
      },
    };
    const method = editing ? 'PUT' : 'POST';
    try {
      const res = await fetch('/api/programs', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error?.message || data.error || 'Failed to save program details.');
      }
      
      showToast(`Program "${form.title}" saved successfully!`, 'success');
      setModalOpen(false);
      setNewModule(EMPTY_MODULE);
      setNewFaq(EMPTY_FAQ);
      load();
    } catch (err: any) {
      showToast(err.message || 'Failed to save program details.', 'error');
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

    const original = [...programs];
    setPrograms(prev => prev.filter(p => p.id !== id));
    showToast('Program deleted successfully', 'success');

    try {
      const res = await fetch('/api/programs', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      if (!res.ok) throw new Error();
      load();
    } catch {
      setPrograms(original);
      showToast('Error deleting program, restored.', 'error');
    }
  };

  // ── Curriculum helpers ──
  const addModule = () => {
    if (!newModule.title) return;
    const mod = {
      week: newModule.week,
      title: newModule.title,
      topics: newModule.topics.split('\n').filter(Boolean),
    };
    setForm((p: any) => ({ ...p, curriculum: [...(p.curriculum || []), mod] }));
    setNewModule(EMPTY_MODULE);
  };
  const removeModule = (i: number) => setForm((p: any) => ({ ...p, curriculum: p.curriculum.filter((_: any, idx: number) => idx !== i) }));

  // ── FAQ helpers ──
  const addFaq = () => {
    if (!newFaq.question) return;
    setForm((p: any) => ({ ...p, faqs: [...(p.faqs || []), { ...newFaq }] }));
    setNewFaq(EMPTY_FAQ);
  };
  const removeFaq = (i: number) => setForm((p: any) => ({ ...p, faqs: p.faqs.filter((_: any, idx: number) => idx !== i) }));

  const filtered = programs.filter(p => {
    const matchSearch = p.title?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || p.type === filter;
    return matchSearch && matchFilter;
  });

  const f = (field: string) => (e: any) => setForm((prev: any) => ({ ...prev, [field]: e.target.value }));

  const TABS: { key: TabKey; label: string; icon: any }[] = [
    { key: 'basic', label: 'Basic Info', icon: GraduationCap },
    { key: 'curriculum', label: `Curriculum (${form.curriculum?.length || 0})`, icon: BookOpen },
    { key: 'faqs', label: `FAQs (${form.faqs?.length || 0})`, icon: HelpCircle },
    { key: 'pricing', label: 'Pricing', icon: DollarSign },
  ];

  return (
    <div className={`${designSystem.spacing.containerMaxWidth} py-8`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Programs</h1>
          <p className="text-sm text-slate-500 mt-1">{programs.length} programs &bull; {programs.filter(p => p.type === 'Premium').length} Premium</p>
        </div>
        <Button onClick={openNew} icon={<Plus className="w-4 h-4" />}>
          Add Program
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search programs..."
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Premium', 'Industrial'].map(fl => (
            <Button
              key={fl}
              onClick={() => setFilter(fl)}
              variant={filter === fl ? 'primary' : 'secondary'}
              size="sm"
            >
              {fl}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filtered.map(p => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card variant="glow" padding="none" className="h-full flex flex-col group border border-slate-100/80 animate-[fadeIn_0.4s_ease-out]">
                <div className="relative h-44 bg-slate-50 overflow-hidden">
                  {p.image ? (
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <GraduationCap className="w-8 h-8 opacity-40 animate-pulse" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 z-10">
                    <Badge variant={p.type === 'Premium' ? 'orange' : 'default'}>{p.type}</Badge>
                  </div>
                  {/* Curriculum badge */}
                  {p.curriculum?.length > 0 && (
                    <div className="absolute bottom-3 left-3 z-10">
                      <Badge variant="success">{p.curriculum.length} Modules</Badge>
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-extrabold text-slate-900 mb-2 leading-snug">{p.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">{p.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                    <div>
                      <span className="text-base font-extrabold text-orange-600">{p.pricing_details?.discountedPrice || p.price}</span>
                      {p.pricing_details?.originalPrice && (
                        <span className="text-xs text-slate-400 line-through ml-2">{p.pricing_details.originalPrice}</span>
                      )}
                    </div>
                    
                    <div className="flex gap-1.5">
                      <Link
                        href={`/programs/${p.slug || p.id}`}
                        target="_blank"
                        className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-blue-50 flex items-center justify-center transition-colors"
                        title="View Live Detail Page"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
                      </Link>
                      <button
                        onClick={() => openEdit(p)}
                        className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-orange-50 flex items-center justify-center transition-colors"
                        title="Edit Program"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-slate-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-red-50 flex items-center justify-center transition-colors"
                        title="Delete Program"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <PremiumEmptyState
          title="No Programs Found"
          description="Try broadening your search term or filtering options."
          icon={GraduationCap}
        />
      )}

      {/* Modal with tabs */}
      <FormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? `Edit: ${editing.title}` : 'Add New Program'} onSubmit={handleSave} loading={loading}>

        {/* Tab bar */}
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6 -mt-2">
          {TABS.map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === tab.key ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── BASIC TAB ── */}
        {activeTab === 'basic' && (
          <div className="space-y-4">
            <Field label="Title" required><Input value={form.title} onChange={f('title')} placeholder="Full Stack Development" /></Field>
            <Field label="Short Description" required><Textarea value={form.description} onChange={f('description')} rows={2} placeholder="One-liner shown on program cards..." /></Field>
            <Field label="Overview (shown on detail page)"><Textarea value={form.overview || ''} onChange={f('overview')} rows={3} placeholder="Full program overview for the detail page..." /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Type"><Select value={form.type} onChange={f('type')}><option>Premium</option><option>Industrial</option></Select></Field>
              <Field label="Category"><Select value={form.category} onChange={f('category')}><option>Development</option><option>Cloud & DevOps</option><option>Data & AI</option><option>AI & Automation</option><option>Marketing & Growth</option><option>Computer Science</option><option>Productivity & Tools</option><option>Business & Strategy</option></Select></Field>
              <Field label="Level"><Select value={form.level} onChange={f('level')}><option>Beginner</option><option>Intermediate</option><option>Advanced</option><option>Beginner to Advanced</option><option>All Levels</option></Select></Field>
              <Field label="Duration"><Input value={form.duration} onChange={f('duration')} placeholder="4-6 Months" /></Field>
              <Field label="Practical Hours"><Input value={form.practical_hours} onChange={f('practical_hours')} placeholder="100+ Hours" /></Field>
              <Field label="Projects Count"><Input type="number" value={form.projects} onChange={f('projects')} /></Field>
            </div>
            <Field label="Tags (comma-separated)"><Input value={form.tags} onChange={f('tags')} placeholder="React, Node.js, AWS" /></Field>
            <Field label="Outcomes (one per line)"><Textarea value={form.outcomes} onChange={f('outcomes')} rows={3} placeholder={"Build full-stack apps\nMaster cloud deployment"} /></Field>
            <ImagePicker value={form.image} onChange={url => setForm((p: any) => ({ ...p, image: url }))} label="Program Cover Image" />
          </div>
        )}

        {/* ── CURRICULUM TAB ── */}
        {activeTab === 'curriculum' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2">Add week-by-week modules. Each module contains topics (one per line).</p>

            {/* Existing modules */}
            {(form.curriculum || []).map((mod: any, i: number) => (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-xs text-orange-500 font-bold">{mod.week || `Module ${i + 1}`}</p>
                    <p className="font-bold text-slate-800">{mod.title}</p>
                  </div>
                  <button type="button" onClick={() => removeModule(i)} className="p-1 rounded hover:bg-red-50 text-red-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <ul className="space-y-1">
                  {(mod.topics || mod.lessons || []).map((t: string, j: number) => (
                    <li key={j} className="text-xs text-slate-600 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-orange-400 shrink-0" /> {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Add new module */}
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 space-y-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Add Module</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500 font-semibold mb-1 block">Week Label</label>
                  <input value={newModule.week} onChange={e => setNewModule(p => ({ ...p, week: e.target.value }))} placeholder="Week 1-2" className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-orange-400" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 font-semibold mb-1 block">Module Title *</label>
                  <input value={newModule.title} onChange={e => setNewModule(p => ({ ...p, title: e.target.value }))} placeholder="React Fundamentals" className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-orange-400" />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 font-semibold mb-1 block">Topics (one per line)</label>
                <textarea value={newModule.topics} onChange={e => setNewModule(p => ({ ...p, topics: e.target.value }))} placeholder={"Components & Props\nHooks deep dive\nState management"} rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-orange-400 resize-none" />
              </div>
              <button type="button" onClick={addModule} disabled={!newModule.title} className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 text-white text-sm font-bold rounded-lg disabled:opacity-50 hover:bg-orange-600 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add Module
              </button>
            </div>
          </div>
        )}

        {/* ── FAQs TAB ── */}
        {activeTab === 'faqs' && (
          <div className="space-y-4">
            {(form.faqs || []).map((faq: any, i: number) => (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex justify-between mb-1">
                  <p className="font-bold text-slate-800 text-sm">{faq.question}</p>
                  <button type="button" onClick={() => removeFaq(i)} className="p-1 rounded hover:bg-red-50 text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{faq.answer}</p>
              </div>
            ))}

            <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 space-y-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Add FAQ</p>
              <div>
                <label className="text-xs text-slate-500 font-semibold mb-1 block">Question *</label>
                <input value={newFaq.question} onChange={e => setNewFaq(p => ({ ...p, question: e.target.value }))} placeholder="Do I need prior experience?" className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-orange-400" />
              </div>
              <div>
                <label className="text-xs text-slate-500 font-semibold mb-1 block">Answer *</label>
                <textarea value={newFaq.answer} onChange={e => setNewFaq(p => ({ ...p, answer: e.target.value }))} placeholder="No prior experience required..." rows={2} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-orange-400 resize-none" />
              </div>
              <button type="button" onClick={addFaq} disabled={!newFaq.question} className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 text-white text-sm font-bold rounded-lg disabled:opacity-50 hover:bg-orange-600 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add FAQ
              </button>
            </div>
          </div>
        )}

        {/* ── PRICING TAB ── */}
        {activeTab === 'pricing' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Display Price (used on cards)"><Input value={form.price} onChange={f('price')} placeholder="₹4,999" /></Field>
              <Field label="Original / Crossed-out Price"><Input value={form.originalPrice} onChange={f('originalPrice')} placeholder="₹9,999" /></Field>
              <Field label="Discounted Price (shown on detail page)"><Input value={form.discountedPrice} onChange={f('discountedPrice')} placeholder="₹4,999" /></Field>
              <Field label="EMI Option"><Input value={form.emi} onChange={f('emi')} placeholder="₹999/month" /></Field>
            </div>
            <Field label="What's Included (one per line)">
              <Textarea
                value={form.includes}
                onChange={f('includes')}
                rows={5}
                placeholder={"Lifetime access to recordings\nLive mentor sessions\nCertificate of completion\nProject reviews\nCommunity access"}
              />
            </Field>
          </div>
        )}

      </FormModal>

      <div className="mt-8 space-y-6 border-t border-slate-100 pt-8">
        <VisualBlockManager
          sectionKey="programs"
          title="Program Graphic Illustrations & Custom Visual Cards CMS"
          subtitle="Manage learning badges, sidebar visual blocks, and detail-page graphic panels."
        />
      </div>

      <ConfirmDeleteModal
        isOpen={confirmDeleteId !== null}
        title="Delete Program"
        message="Are you sure you want to permanently delete this program? All curriculum and FAQ details will be lost forever."
        onConfirm={executeDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}

