"use client";
import { useState, useEffect } from 'react';
import { Search, Plus, Target, DollarSign, Award, Edit2, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/Button";
import FormModal, { Field } from '@/components/admin/FormModal';
import { Input, Select } from "@/components/ui/FormElements";
import { showToast } from '@/components/ui/PremiumToast';
import { ConfirmDeleteModal } from '@/components/admin/ConfirmDeleteModal';
import { Opportunity } from '@/types';

const EMPTY_OPPORTUNITY: Partial<Opportunity> = {
  title: '',
  client: '',
  value: '',
  stage: 'Discovery',
  closeDate: '',
  probability: '',
};

export default function OpportunitiesPage() {
  const [search, setSearch] = useState('');
  const [deals, setDeals] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Opportunity | null>(null);
  const [form, setForm] = useState<Partial<Opportunity>>(EMPTY_OPPORTUNITY);
  const [saving, setSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const load = () => {
    fetch('/api/opportunities', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        const items = d.success && Array.isArray(d.data) ? d.data : [];
        setDeals(items);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setForm({ ...EMPTY_OPPORTUNITY });
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (deal: Opportunity) => {
    setForm({ ...deal });
    setEditing(deal);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title?.trim() || !form.client?.trim() || !form.value?.trim()) {
      showToast('Title, Client, and Value are required!', 'error');
      return;
    }

    setSaving(true);
    const method = editing ? 'PUT' : 'POST';
    const payload = { ...form };

    try {
      const res = await fetch('/api/opportunities', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error?.message || 'Failed to save deal.');
      
      showToast(`Deal "${form.title}" saved successfully!`, 'success');
      setModalOpen(false);
      load();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const executeDelete = async () => {
    if (!confirmDeleteId) return;
    const id = confirmDeleteId;
    setConfirmDeleteId(null);

    const original = [...deals];
    setDeals(prev => prev.filter(d => d.id !== id));
    showToast('Deal deleted successfully', 'success');

    try {
      const res = await fetch('/api/opportunities', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (!res.ok) throw new Error();
      load();
    } catch {
      setDeals(original);
      showToast('Error deleting deal, restored.', 'error');
    }
  };

  const filtered = deals.filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.client.toLowerCase().includes(search.toLowerCase())
  );

  // Dynamic KPIs Calculation
  const calculatePipelineValue = () => {
    return deals
      .filter(d => d.stage !== 'Won' && d.stage !== 'Lost')
      .reduce((acc, curr) => {
        // Strip non-numeric characters (except dot) for basic addition
        const val = Number(curr.value.replace(/[^0-9.]/g, ''));
        return acc + (isNaN(val) ? 0 : val);
      }, 0);
  };

  const calculateWonValue = () => {
    return deals
      .filter(d => d.stage === 'Won')
      .reduce((acc, curr) => {
        const val = Number(curr.value.replace(/[^0-9.]/g, ''));
        return acc + (isNaN(val) ? 0 : val);
      }, 0);
  };

  const activeDealsCount = deals.filter(d => d.stage !== 'Won' && d.stage !== 'Lost').length;
  
  // Format Indian currency natively for the KPIs
  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Sales Opportunities</h1>
          <p className="text-sm text-slate-500 font-medium">Track enterprise training contracts and institutional conversions</p>
        </div>
        <Button size="sm" onClick={openNew} icon={<Plus className="w-4 h-4" />}>
          New Deal
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Pipeline Value</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{formatINR(calculatePipelineValue())}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Active Opportunities</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{activeDealsCount} Active Deals</p>
          </div>
        </div>
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-green-600">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Won Contracts</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{formatINR(calculateWonValue())}</p>
          </div>
        </div>
      </div>

      {/* Filter and Table */}
      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search deals..."
            className="w-full h-11 bg-white border border-slate-200 text-slate-900 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
          />
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/50">
                <tr>
                  {['Deal Title', 'Client', 'Value', 'Stage', 'Close Date', 'Probability', 'Actions'].map(h => (
                    <th key={h} className={`text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500 font-medium">Loading opportunities...</td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500 font-medium">No opportunities found.</td>
                  </tr>
                ) : (
                  filtered.map(d => (
                    <tr key={d.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">{d.title}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-700 font-semibold">{d.client}</td>
                      <td className="px-6 py-4 text-slate-900 font-extrabold">{d.value}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          d.stage === 'Won' ? 'bg-green-50 text-green-700 border border-green-100' :
                          d.stage === 'Negotiation' ? 'bg-orange-50 text-orange-700 border border-orange-100' :
                          d.stage === 'Proposal' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                          d.stage === 'Lost' ? 'bg-red-50 text-red-700 border border-red-100' :
                          'bg-blue-50 text-blue-700 border border-blue-100'
                        }`}>{d.stage}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs font-semibold">{d.closeDate}</td>
                      <td className="px-6 py-4 text-slate-600 font-bold text-xs">{d.probability}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEdit(d)}
                            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-orange-50 flex items-center justify-center transition-colors"
                            title="Edit Deal"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-slate-600 hover:text-orange-600" />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(d.id)}
                            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-red-50 flex items-center justify-center transition-colors"
                            title="Delete Deal"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      <FormModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title={editing ? `Edit: ${editing.title}` : 'Add New Deal'} 
        onSubmit={handleSave} 
        loading={saving}
      >
        <div className="space-y-4">
          <Field label="Deal Title" required>
            <Input 
              value={form.title || ''} 
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))} 
              placeholder="e.g. Corporate React Training" 
            />
          </Field>
          <Field label="Client Name" required>
            <Input 
              value={form.client || ''} 
              onChange={e => setForm(p => ({ ...p, client: e.target.value }))} 
              placeholder="e.g. Tech Mahindra" 
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Value (formatted)" required>
              <Input 
                value={form.value || ''} 
                onChange={e => setForm(p => ({ ...p, value: e.target.value }))} 
                placeholder="e.g. ₹4,50,000" 
              />
            </Field>
            <Field label="Stage">
              <Select 
                value={form.stage || 'Discovery'} 
                onChange={e => setForm(p => ({ ...p, stage: e.target.value as any }))}
              >
                <option value="Discovery">Discovery</option>
                <option value="Proposal">Proposal</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Won">Won</option>
                <option value="Lost">Lost</option>
              </Select>
            </Field>
            <Field label="Close Date">
              <Input 
                value={form.closeDate || ''} 
                onChange={e => setForm(p => ({ ...p, closeDate: e.target.value }))} 
                placeholder="15 Jun 2026" 
              />
            </Field>
            <Field label="Probability">
              <Input 
                value={form.probability || ''} 
                onChange={e => setForm(p => ({ ...p, probability: e.target.value }))} 
                placeholder="80%" 
              />
            </Field>
          </div>
        </div>
      </FormModal>

      <ConfirmDeleteModal
        isOpen={confirmDeleteId !== null}
        title="Delete Deal"
        message="Are you sure you want to permanently delete this sales opportunity? This cannot be undone."
        onConfirm={executeDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}
