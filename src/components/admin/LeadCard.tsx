"use client";
import { motion } from 'framer-motion';
import { Phone, Mail, Clock, ChevronDown } from 'lucide-react';

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  New: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  Contacted: { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500' },
  Converted: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  Closed: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
};

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  program?: string;
  status?: string;
  message?: string;
  created_at?: string;
  createdAt?: string;
  current_status?: string;
  currentStatus?: string;
}

interface LeadCardProps {
  lead: Lead;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}

export default function LeadCard({ lead, onStatusChange, onDelete }: LeadCardProps) {
  const status = lead.status || 'New';
  const colors = STATUS_COLORS[status] || STATUS_COLORS.New;
  const date = new Date(lead.created_at || lead.createdAt || '').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-extrabold text-slate-900 text-base">{lead.name}</h3>
          {lead.program && (
            <span className="inline-block text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full mt-1">
              {lead.program}
            </span>
          )}
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${colors.bg} ${colors.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
          {status}
        </div>
      </div>

      <div className="space-y-1.5 mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Mail className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{lead.email}</span>
        </div>
        {lead.phone && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Phone className="w-3.5 h-3.5 shrink-0" />
            <span>{lead.phone}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Clock className="w-3 h-3 shrink-0" />
          <span>{date}</span>
        </div>
        {(lead.current_status || lead.currentStatus) && (
          <p className="text-xs text-slate-500 italic">{lead.current_status || lead.currentStatus}</p>
        )}
      </div>

      {lead.message && (
        <p className="text-xs text-slate-500 italic bg-slate-50 rounded-lg p-2 mb-3 line-clamp-2">
          "{lead.message}"
        </p>
      )}

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <select
            value={status}
            onChange={e => onStatusChange(lead.id, e.target.value)}
            className="w-full h-8 pl-3 pr-7 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 appearance-none"
          >
            {Object.keys(STATUS_COLORS).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
        </div>
        <button
          onClick={() => onDelete(lead.id)}
          className="h-8 px-3 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 text-xs font-semibold transition-colors"
        >
          Delete
        </button>
      </div>
    </motion.div>
  );
}
