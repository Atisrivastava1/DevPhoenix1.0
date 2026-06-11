"use client";

import { useEffect, useState } from 'react';
import { Mail, Phone, ExternalLink, Globe, Save, Plus, Trash2, Link2, Sparkles, MapPin } from 'lucide-react';

const FALLBACK_SOCIALS = {
  instagram: '',
  linkedin: '',
  facebook: '',
  twitter: '',
  github: ''
};

export default function AdminFooterPage() {
  const [config, setConfig] = useState<any>({
    contact: { email: '', phone: '', address: '' },
    socials: { ...FALLBACK_SOCIALS },
    footer: { tagline: '', copyright: '' },
    footerColumns: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/site-config', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        const payload = d && d.success && d.data ? d.data : (d || {});
        setConfig({
          contact: payload.contact || { email: '', phone: '', address: '' },
          socials: { ...FALLBACK_SOCIALS, ...(payload.socials || {}) },
          footer: payload.footer || { tagline: '', copyright: '' },
          footerColumns: payload.footerColumns || []
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/site-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (res.ok) {
        setMessage('Footer settings saved successfully!');
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

  const handleContactChange = (field: string, val: string) => {
    setConfig((prev: any) => ({
      ...prev,
      contact: { ...prev.contact, [field]: val }
    }));
  };

  const handleSocialChange = (field: string, val: string) => {
    setConfig((prev: any) => ({
      ...prev,
      socials: { ...prev.socials, [field]: val }
    }));
  };

  const handleFooterChange = (field: string, val: string) => {
    setConfig((prev: any) => ({
      ...prev,
      footer: { ...prev.footer, [field]: val }
    }));
  };

  const addColumn = () => {
    setConfig((prev: any) => ({
      ...prev,
      footerColumns: [...prev.footerColumns, { title: 'New Column', links: [] }]
    }));
  };

  const removeColumn = (colIdx: number) => {
    if (!confirm('Are you sure you want to remove this column?')) return;
    setConfig((prev: any) => ({
      ...prev,
      footerColumns: prev.footerColumns.filter((_: any, i: number) => i !== colIdx)
    }));
  };

  const updateColumnTitle = (colIdx: number, title: string) => {
    setConfig((prev: any) => {
      const updated = [...prev.footerColumns];
      updated[colIdx] = { ...updated[colIdx], title };
      return { ...prev, footerColumns: updated };
    });
  };

  const addLink = (colIdx: number) => {
    setConfig((prev: any) => {
      const updated = [...prev.footerColumns];
      updated[colIdx] = {
        ...updated[colIdx],
        links: [...updated[colIdx].links, { label: 'New Link', href: '#' }]
      };
      return { ...prev, footerColumns: updated };
    });
  };

  const updateLink = (colIdx: number, linkIdx: number, field: string, val: string) => {
    setConfig((prev: any) => {
      const updated = [...prev.footerColumns];
      const updatedLinks = [...updated[colIdx].links];
      updatedLinks[linkIdx] = { ...updatedLinks[linkIdx], [field]: val };
      updated[colIdx] = { ...updated[colIdx], links: updatedLinks };
      return { ...prev, footerColumns: updated };
    });
  };

  const removeLink = (colIdx: number, linkIdx: number) => {
    setConfig((prev: any) => {
      const updated = [...prev.footerColumns];
      updated[colIdx] = {
        ...updated[colIdx],
        links: updated[colIdx].links.filter((_: any, i: number) => i !== linkIdx)
      };
      return { ...prev, footerColumns: updated };
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
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Footer Configuration</h1>
          <p className="text-slate-400 text-sm">Configure your cinematic footer data including contact info, social links, and links columns dynamically.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 shrink-0 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {message && (
        <div className="p-4 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-xl text-sm font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 animate-pulse" />
          {message}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column: Brand & Contact Info */}
        <div className="space-y-6">
          {/* Brand Info */}
          <div className="bg-[#151821] border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Globe className="w-4 h-4 text-orange-500" />
              Footer Brand Info
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 font-semibold mb-1 block">Footer Tagline</label>
                <textarea
                  value={config.footer.tagline}
                  onChange={e => handleFooterChange('tagline', e.target.value)}
                  rows={3}
                  placeholder="Cinematic brand description..."
                  className="w-full bg-[#0d0f14] border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/50 resize-none"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 font-semibold mb-1 block">Copyright Text</label>
                <input
                  type="text"
                  value={config.footer.copyright}
                  onChange={e => handleFooterChange('copyright', e.target.value)}
                  placeholder="© 2026 DevPhoeniX. All rights reserved."
                  className="w-full bg-[#0d0f14] border border-slate-800 rounded-xl h-10 px-4 text-white text-sm focus:outline-none focus:border-orange-500/50"
                />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-[#151821] border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Mail className="w-4 h-4 text-orange-500" />
              Contact Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 font-semibold mb-1 block">Support Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input
                    type="email"
                    value={config.contact.email}
                    onChange={e => handleContactChange('email', e.target.value)}
                    placeholder="support@devphoenix.tech"
                    className="w-full bg-[#0d0f14] border border-slate-800 rounded-xl h-10 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-orange-500/50 font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 font-semibold mb-1 block">Support Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input
                    type="text"
                    value={config.contact.phone}
                    onChange={e => handleContactChange('phone', e.target.value)}
                    placeholder="+91 9734876490"
                    className="w-full bg-[#0d0f14] border border-slate-800 rounded-xl h-10 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-orange-500/50 font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 font-semibold mb-1 block">Office/Location Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input
                    type="text"
                    value={config.contact.address}
                    onChange={e => handleContactChange('address', e.target.value)}
                    placeholder="Mumbai, Maharashtra, India"
                    className="w-full bg-[#0d0f14] border border-slate-800 rounded-xl h-10 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-orange-500/50"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Social Links */}
        <div className="space-y-6">
          <div className="bg-[#151821] border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-500" />
              Social Media Links
            </h2>
            <div className="space-y-4">
              {Object.keys(FALLBACK_SOCIALS).map(platform => (
                <div key={platform}>
                  <label className="text-xs text-slate-500 font-semibold mb-1 block capitalize">{platform} Profile URL</label>
                  <input
                    type="text"
                    value={config.socials[platform] || ''}
                    onChange={e => handleSocialChange(platform, e.target.value)}
                    placeholder={`https://www.example.com/${platform}/devphoenix`}
                    className="w-full bg-[#0d0f14] border border-slate-800 rounded-xl h-10 px-4 text-white text-sm focus:outline-none focus:border-orange-500/50 font-mono"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Link Columns Section */}
      <div className="bg-[#151821] border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Link2 className="w-4 h-4 text-orange-500" />
            Footer Navigation Links Columns
          </h2>
          <button
            type="button"
            onClick={addColumn}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white rounded-lg transition-colors border border-slate-700"
          >
            <Plus className="w-3.5 h-3.5" /> Add Column
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 pt-2">
          {config.footerColumns.map((col: any, colIdx: number) => (
            <div key={colIdx} className="bg-[#0d0f14] border border-slate-800 rounded-xl p-4 space-y-4 relative">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={col.title}
                  onChange={e => updateColumnTitle(colIdx, e.target.value)}
                  className="bg-transparent border-b border-transparent hover:border-slate-800 focus:border-orange-500/50 font-bold text-white text-sm focus:outline-none px-1"
                />
                <button
                  type="button"
                  onClick={() => removeColumn(colIdx)}
                  className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                  title="Remove Column"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Links list */}
              <div className="space-y-3">
                {col.links.map((link: any, linkIdx: number) => (
                  <div key={linkIdx} className="flex gap-2 items-center bg-[#151821]/50 p-2 rounded-lg border border-slate-800/40">
                    <input
                      type="text"
                      value={link.label}
                      onChange={e => updateLink(colIdx, linkIdx, 'label', e.target.value)}
                      placeholder="Label"
                      className="w-1/3 bg-[#0d0f14] border border-slate-800 rounded-lg h-8 px-2 text-white text-xs focus:outline-none"
                    />
                    <input
                      type="text"
                      value={link.href}
                      onChange={e => updateLink(colIdx, linkIdx, 'href', e.target.value)}
                      placeholder="URL"
                      className="flex-1 bg-[#0d0f14] border border-slate-800 rounded-lg h-8 px-2 text-white text-xs font-mono focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeLink(colIdx, linkIdx)}
                      className="p-1 text-slate-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => addLink(colIdx)}
                className="flex items-center justify-center gap-1 w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800/80 rounded-lg text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Link
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
