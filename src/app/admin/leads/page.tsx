"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Download, Filter, ChevronDown, X, MessageSquare,
  Phone, Mail, User, Clock, CheckCircle2, AlertCircle,
  ChevronRight, ArrowUpDown, Inbox
} from "lucide-react";
import { Lead, LeadStatus } from "@/types";
import { showToast } from "@/components/ui/PremiumToast";
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge, BadgeVariant } from "@/components/ui/Badge";
import { Input } from "@/components/ui/FormElements";
import { PremiumEmptyState } from "@/components/ui/PremiumEmptyState";
import { designSystem } from "@/lib/design-system";


// ─── Constants ───────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<LeadStatus, { color: string; bg: string; dot: string }> = {
  'New':                    { color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200',    dot: 'bg-blue-500' },
  'Contacted':              { color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', dot: 'bg-orange-500' },
  'Qualified':              { color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200', dot: 'bg-purple-500' },
  'Consultation Scheduled': { color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200', dot: 'bg-yellow-500' },
  'Converted':              { color: 'text-green-700',  bg: 'bg-green-50 border-green-200',   dot: 'bg-green-500' },
  'Closed':                 { color: 'text-slate-700',  bg: 'bg-slate-100 border-slate-200',  dot: 'bg-slate-500' },
  'Lost':                   { color: 'text-red-700',    bg: 'bg-red-50 border-red-200',       dot: 'bg-red-400' },
};

const ALL_STATUSES: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Consultation Scheduled', 'Converted', 'Closed', 'Lost'];

// ─── StatusBadge ─────────────────────────────────────────────────────────────

const STATUS_MAP: Record<LeadStatus, BadgeVariant> = {
  'New': 'info',
  'Contacted': 'orange',
  'Qualified': 'purple',
  'Consultation Scheduled': 'warning',
  'Converted': 'success',
  'Closed': 'default',
  'Lost': 'danger',
};

function StatusBadge({ status }: { status: LeadStatus }) {
  const badgeVar = STATUS_MAP[status] || 'default';
  return <Badge variant={badgeVar}>{status}</Badge>;
}

// ─── LeadDetail Slide-over ────────────────────────────────────────────────────

function LeadDetailPanel({ lead, onClose, onUpdate }: {
  lead: Lead;
  onClose: () => void;
  onUpdate: (updatedLead?: Lead) => void;
}) {
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [saving, setSaving] = useState(false);

  const handleStatusChange = async (newStatus: LeadStatus) => {
    setStatus(newStatus);
    try {
      const res = await fetch('/api/leads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: lead.id, status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update lead status.');
      showToast(`Status updated to "${newStatus}"`, 'success');
      onUpdate(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to update lead status.', 'error');
    }
  };

  const handleAddNote = async () => {
    if (!note.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: lead.id, action: 'add_note', note }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add note.');
      setNote('');
      showToast('Note added successfully!', 'success');
      onUpdate(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to add note.', 'error');
    } finally {
      setSaving(false);
    }
  };


  const waMessage = encodeURIComponent(
    `Hi ${lead.name},\n\nThank you for your interest in the ${lead.program || 'DevPhoeniX'} program!\n\nI'm reaching out to share more details and answer any questions you have.\n\nTeam DevPhoeniX 🔥`
  );
  const waPhone = lead.phone?.replace(/\D/g, '');

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{lead.name}</h2>
            <p className="text-sm text-slate-500">{lead.email}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Phone</p>
              <p className="font-semibold text-slate-900 flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-500" /> {lead.phone}
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Program</p>
              <p className="font-semibold text-slate-900 text-sm">{lead.program || '—'}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Current Status</p>
              <p className="font-semibold text-slate-900 text-sm">{lead.currentStatus || '—'}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Source</p>
              <p className="font-semibold text-slate-900 text-sm">{lead.source_page || 'Direct'}</p>
            </div>
          </div>

          {lead.message && (
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
              <p className="text-xs font-bold text-orange-600 uppercase tracking-wide mb-2">Message</p>
              <p className="text-slate-700 text-sm leading-relaxed">"{lead.message}"</p>
            </div>
          )}

          {/* Status Management */}
          <div>
            <p className="text-sm font-bold text-slate-700 mb-3">Pipeline Status</p>
            <div className="flex flex-wrap gap-2">
              {ALL_STATUSES.map(s => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                    status === s
                      ? `${STATUS_CONFIG[s].bg} ${STATUS_CONFIG[s].color} shadow-sm scale-105`
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <p className="text-sm font-bold text-slate-700 mb-3">Quick Contact</p>
            <div className="flex gap-3">
              <a
                href={`mailto:${lead.email}?subject=Re: ${lead.program} - DevPhoeniX&body=Hi ${lead.name},%0A%0A`}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-orange-500 transition-colors"
              >
                <Mail className="w-4 h-4" /> Email
              </a>
              <a
                href={`https://wa.me/${waPhone}?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500 text-white text-sm font-bold hover:bg-green-600 transition-colors"
              >
                <MessageSquare className="w-4 h-4" /> WhatsApp
              </a>
              <a
                href={`tel:${lead.phone}`}
                className="px-4 py-3 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 text-sm font-bold hover:bg-blue-100 transition-colors flex items-center gap-2"
              >
                <Phone className="w-4 h-4" /> Call
              </a>
            </div>
          </div>

          {/* Notes */}
          <div>
            <p className="text-sm font-bold text-slate-700 mb-3">Notes & Timeline</p>
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
              {(lead.notes || []).length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4 bg-slate-50 rounded-xl">No notes yet</p>
              ) : (
                [...(lead.notes || [])].reverse().map(n => (
                  <div key={n.id} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <p className="text-sm text-slate-700">{n.content}</p>
                    <p className="text-xs text-slate-400 mt-1">{n.author} · {new Date(n.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <input
                value={note}
                onChange={e => setNote(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddNote()}
                placeholder="Add a note..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 transition-colors"
              />
              <button
                onClick={handleAddNote}
                disabled={saving || !note.trim()}
                className="px-4 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 disabled:opacity-50 transition-colors"
              >
                {saving ? '...' : 'Add'}
              </button>
            </div>
          </div>

          {/* Meta */}
          <div className="pt-4 border-t border-slate-100 text-xs text-slate-400 space-y-1">
            <p>Created: {new Date(lead.created_at).toLocaleString('en-IN')}</p>
            {lead.updated_at && <p>Updated: {new Date(lead.updated_at).toLocaleString('en-IN')}</p>}
            {lead.last_contacted_at && <p>Last Contacted: {new Date(lead.last_contacted_at).toLocaleString('en-IN')}</p>}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main CRM Page ────────────────────────────────────────────────────────────

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | LeadStatus>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [page, setPage] = useState(1);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const PER_PAGE = 10;

  const load = async () => {
    setLoading(true);
    const data = await fetch('/api/leads').then(r => r.json()).catch(() => []);
    setLeads(Array.isArray(data) ? data : []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleDelete = (id: string) => {
    setConfirmDeleteId(id);
  };

  const executeDelete = async () => {
    if (!confirmDeleteId) return;
    const id = confirmDeleteId;
    setConfirmDeleteId(null);

    const original = [...leads];
    setLeads(prev => prev.filter(l => l.id !== id));
    showToast('Lead deleted successfully', 'success');

    try {
      const res = await fetch('/api/leads', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      if (!res.ok) throw new Error();
      load();
    } catch {
      setLeads(original);
      showToast('Error deleting lead, restored.', 'error');
    }
  };

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Program', 'Status', 'Source', 'Message', 'Date'];
    const rows = leads.map(l => [l.name, l.email, l.phone, l.program, l.status, l.source_page || '', l.message || '', l.created_at]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c || '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `devphoenix-leads-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
  };

  // Filter & sort
  let filtered = leads.filter(l => {
    const q = search.toLowerCase();
    const matchSearch = !search || l.name?.toLowerCase().includes(q) || l.email?.toLowerCase().includes(q) || l.phone?.includes(q) || l.program?.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'All' || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    return a.name.localeCompare(b.name);
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Stats
  const counts: Partial<Record<LeadStatus | 'All', number>> = { All: leads.length };
  leads.forEach(l => { counts[l.status] = (counts[l.status] || 0) + 1; });
  const conversionRate = leads.length > 0 ? Math.round(((counts['Converted'] || 0) / leads.length) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1">Lead CRM</h1>
          <p className="text-sm text-slate-400 font-medium">{leads.length} total leads &bull; {conversionRate}% conversion rate</p>
        </div>
        <Button onClick={exportCSV} variant="outline" size="sm" icon={<Download className="w-4 h-4" />}>
          Export CSV
        </Button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {(['New', 'Contacted', 'Qualified', 'Converted'] as LeadStatus[]).map(s => {
          const badgeVar = STATUS_MAP[s] || 'default';
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(statusFilter === s ? 'All' : s)}
              className={`p-5 rounded-2xl border text-left transition-all duration-300 ${
                statusFilter === s
                  ? 'bg-white text-slate-900 border-white shadow-xl scale-[1.03]'
                  : 'bg-[#151821] border-slate-800/80 hover:border-slate-700/80'
              }`}
            >
              <p className={`text-3xl font-extrabold mb-1.5 ${statusFilter === s ? 'text-slate-900' : 'text-white'}`}>{counts[s] || 0}</p>
              <Badge variant={badgeVar}>{s}</Badge>
            </button>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, email, phone, program..."
            className="w-full h-11 bg-[#151821] border border-slate-800 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value as any); setPage(1); }}
          className="bg-[#151821] border border-slate-800 text-slate-300 rounded-xl px-4 h-11 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
        >
          <option value="All">All Statuses</option>
          {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as any)}
          className="bg-[#151821] border border-slate-800 text-slate-300 rounded-xl px-4 h-11 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="name">Name A-Z</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#151821] border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-16 text-center text-slate-500 font-bold animate-pulse">Loading leads...</div>
        ) : paginated.length === 0 ? (
          <PremiumEmptyState
            title="No CRM Leads Found"
            description="Try modifying your search query or selecting a different status filter."
            icon={Inbox}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead className="border-b border-slate-800 bg-[#0d0f14]/50">
                <tr>
                  {['Lead', 'Program', 'Status', 'Source', 'Date', ''].map(h => (
                    <th key={h} className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {paginated.map(lead => (
                  <tr
                    key={lead.id}
                    className="hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-white">{lead.name}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{lead.email}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{lead.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="orange">{lead.program || '—'}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={lead.status || 'New'} />
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs font-semibold">{lead.source_page || 'Direct'}</td>
                    <td className="px-6 py-4 text-slate-400 text-xs whitespace-nowrap">
                      {new Date(lead.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </td>
                    <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                          title="Open details"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(lead.id)}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-slate-400 font-medium">Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm disabled:opacity-40 transition-colors">← Prev</button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm disabled:opacity-40 transition-colors">Next →</button>
          </div>
        </div>
      )}

      {/* Lead Detail Slide-over */}
      <AnimatePresence>
        {selectedLead && (
          <LeadDetailPanel
            lead={selectedLead}
            onClose={() => setSelectedLead(null)}
            onUpdate={(updated) => {
              load();
              if (updated) setSelectedLead(updated);
            }}
          />
        )}
      </AnimatePresence>

      <ConfirmDeleteModal
        isOpen={confirmDeleteId !== null}
        title="Delete Lead"
        message="Are you sure you want to permanently delete this lead? All contact information and communication history will be lost."
        onConfirm={executeDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}

