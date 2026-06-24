"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, KeyRound, Eye, EyeOff } from 'lucide-react';
import { Field, Input } from '@/components/admin/FormModal';

export default function AdminSettings() {
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState('');

  const handlePasswordChange = async () => {
    if (!newPw || newPw.length < 6) { setMsg('Password must be at least 6 characters.'); return; }
    // In a real app this would call an API. For now, shows a message.
    setMsg('Password change requires updating ADMIN_PASSWORD in your .env.local file and restarting the server.');
  };

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Admin panel configuration.</p>
      </div>

      <div className="space-y-6">
        {/* Password */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-orange-500" /> Change Admin Password
          </h2>
          <div className="space-y-4">
            <Field label="Current Password">
              <div className="relative">
                <Input type={show ? 'text' : 'password'} value={oldPw} onChange={e => setOldPw(e.target.value)} placeholder="Current password" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </Field>
            <Field label="New Password"><Input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Min 6 characters" /></Field>
          </div>
          {msg && <p className="mt-3 text-sm text-amber-700 bg-amber-50 rounded-xl px-4 py-3">{msg}</p>}
          <button onClick={handlePasswordChange} className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all">
            <Save className="w-4 h-4" /> Update Password
          </button>
        </div>

        {/* System info */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-lg font-extrabold text-slate-900 mb-4">System Info</h2>
          <div className="space-y-3 text-sm">
            {[
              ['Platform', 'Next.js 16.2.6 (Turbopack)'],
              ['Storage', 'Local JSON files (src/data/)'],
              ['Auth', 'Cookie-based session'],
              ['Admin URL', '/admin'],
              ['Default Password', 'devphoenix2025'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-slate-500 font-medium">{k}</span>
                <span className="text-slate-900 font-bold text-xs bg-slate-50 px-3 py-1 rounded-full">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
