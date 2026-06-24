"use client";

import { useEffect, useState } from 'react';
import { Layout, Link2, Eye, Save, Plus, Trash2, ArrowUp, ArrowDown, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function AdminNavbarPage() {
  const [navItems, setNavItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/site-config')
      .then(r => r.json())
      .then(data => {
        if (data && Array.isArray(data.navItems)) {
          setNavItems(data.navItems);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      // First get the rest of the site config to avoid overwriting other settings
      const currentRes = await fetch('/api/site-config');
      const currentData = await currentRes.json();

      const updated = {
        ...currentData,
        navItems
      };

      const res = await fetch('/api/site-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });

      if (res.ok) {
        setMessage('Navigation links saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to save settings.');
      }
    } catch {
      setMessage('An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const addNavItem = () => {
    setNavItems(prev => [...prev, { label: 'New Item', href: '/' }]);
  };

  const updateNavItem = (index: number, field: string, val: string) => {
    setNavItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: val };
      return updated;
    });
  };

  const removeNavItem = (index: number) => {
    if (navItems.length <= 1) {
      alert("You must keep at least one navigation link.");
      return;
    }
    setNavItems(prev => prev.filter((_, i) => i !== index));
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    setNavItems(prev => {
      const updated = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= updated.length) return prev;

      // Swap
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return updated;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Navigation Menu</h1>
          <p className="text-slate-400 text-sm font-medium">Public header navigation links. Customize labels, paths, order and visibility instantly.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={addNavItem}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-sm font-semibold rounded-xl transition-all"
          >
            <Plus className="w-4 h-4" /> Add Item
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {message && (
        <div className="p-4 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-xl text-sm font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 animate-pulse" />
          {message}
        </div>
      )}

      <div className="bg-[#151821] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center gap-2">
          <Layout className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-bold text-slate-300">Navigation Menu Items</span>
          <span className="ml-auto text-xs text-slate-500 font-medium font-mono">{navItems.length} Links</span>
        </div>

        <div className="divide-y divide-slate-800/60 p-4 space-y-3 divide-y-0">
          {navItems.map((link, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3 bg-[#0d0f14] border border-slate-800/80 rounded-xl">
              
              {/* Index & Reorder tools */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-600 font-mono w-5 text-center">{idx + 1}</span>
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => moveItem(idx, 'up')}
                    disabled={idx === 0}
                    className="p-0.5 text-slate-600 hover:text-orange-500 disabled:opacity-30 disabled:hover:text-slate-600 transition-colors"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveItem(idx, 'down')}
                    disabled={idx === navItems.length - 1}
                    className="p-0.5 text-slate-600 hover:text-orange-500 disabled:opacity-30 disabled:hover:text-slate-600 transition-colors"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Inputs */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                <div>
                  <label className="text-[10px] text-slate-600 font-bold uppercase mb-1 block">Link Label</label>
                  <input
                    type="text"
                    value={link.label}
                    onChange={e => updateNavItem(idx, 'label', e.target.value)}
                    placeholder="Home"
                    className="w-full bg-[#151821] border border-slate-800 rounded-lg h-9 px-3 text-white text-sm focus:outline-none focus:border-orange-500/50"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-600 font-bold uppercase mb-1 block">Link Path (HREF)</label>
                  <div className="relative">
                    <Link2 className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
                    <input
                      type="text"
                      value={link.href}
                      onChange={e => updateNavItem(idx, 'href', e.target.value)}
                      placeholder="/programs"
                      className="w-full bg-[#151821] border border-slate-800 rounded-lg h-9 pl-8 pr-3 text-white text-sm font-mono focus:outline-none focus:border-orange-500/50"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <Link
                  href={link.href}
                  target="_blank"
                  className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-orange-400 transition-colors"
                  title="Test Link"
                >
                  <Eye className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => removeNavItem(idx)}
                  className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                  title="Delete Link"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
