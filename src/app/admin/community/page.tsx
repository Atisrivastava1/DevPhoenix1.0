"use client";

import { useEffect, useState } from 'react';
import { Save, RefreshCw, Users, Video, Zap, MessageSquare, Plus, Trash2, Heart } from 'lucide-react';
import { Field, Input, Textarea } from '@/components/admin/FormModal';
import VisualBlockManager from '@/components/admin/VisualBlockManager';

export default function AdminCommunityPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/community').then(r => r.json()).catch(() => null);
    setData(res);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/community', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateHighlight = (section: string, field: string, val: string) => {
    setData((prev: any) => ({
      ...prev,
      highlights: {
        ...prev.highlights,
        [section]: {
          ...prev.highlights[section],
          [field]: val
        }
      }
    }));
  };

  const updateStat = (idx: number, field: string, val: string) => {
    setData((prev: any) => {
      const stats = [...prev.stats];
      stats[idx] = { ...stats[idx], [field]: val };
      return { ...prev, stats };
    });
  };

  const updateFeature = (idx: number, field: string, val: string) => {
    setData((prev: any) => {
      const features = [...prev.features];
      features[idx] = { ...features[idx], [field]: val };
      return { ...prev, features };
    });
  };

  const updateSocial = (idx: number, field: string, val: string) => {
    setData((prev: any) => {
      const socials = [...prev.socials];
      socials[idx] = { ...socials[idx], [field]: val };
      return { ...prev, socials };
    });
  };

  const addSocial = () => {
    setData((prev: any) => ({
      ...prev,
      socials: [...prev.socials, { label: 'New Channel', href: 'https://...' }]
    }));
  };

  const removeSocial = (idx: number) => {
    setData((prev: any) => ({
      ...prev,
      socials: prev.socials.filter((_: any, i: number) => i !== idx)
    }));
  };

  if (loading) return <div className="p-8 text-slate-400 animate-pulse">Loading community data...</div>;
  if (!data) return <div className="p-8 text-red-500">Failed to load community configuration.</div>;

  const highlights = data.highlights || {};

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 text-slate-200">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Community &amp; Ecosystem Editor</h1>
          <p className="text-slate-400 mt-1">Configure real-time community statistics, mentor quotes, learning paths visuals, and social integrations.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-5 py-2.5 font-bold rounded-xl shadow-md transition-all ${saved ? 'bg-green-500 text-white' : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:opacity-90'} disabled:opacity-60 shrink-0`}
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Config'}
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left/Main Column: Highlights & Features */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Highlights Editor */}
          <div className="bg-[#151821] border border-slate-800 rounded-2xl p-6 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Zap className="w-5 h-5 text-orange-500" /> Interactive Community Highlights
            </h2>
            
            {/* Mentor quote */}
            {highlights.mentorFeedback && (
              <div className="space-y-4 bg-slate-900/40 p-4 rounded-xl border border-slate-800">
                <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">Mentor Review Card</p>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Card Title"><Input value={highlights.mentorFeedback.title} onChange={e => updateHighlight('mentorFeedback', 'title', e.target.value)} /></Field>
                  <Field label="Badge"><Input value={highlights.mentorFeedback.badge} onChange={e => updateHighlight('mentorFeedback', 'badge', e.target.value)} /></Field>
                </div>
                <Field label="Mentor Review Quote"><Textarea value={highlights.mentorFeedback.quote} onChange={e => updateHighlight('mentorFeedback', 'quote', e.target.value)} rows={2} /></Field>
                <Field label="Code Snippet Preview"><Textarea value={highlights.mentorFeedback.code} onChange={e => updateHighlight('mentorFeedback', 'code', e.target.value)} rows={3} className="font-mono text-xs" /></Field>
              </div>
            )}

            {/* Live Workshop */}
            {highlights.liveWorkshop && (
              <div className="space-y-4 bg-slate-900/40 p-4 rounded-xl border border-slate-800">
                <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">Live Workshop Card</p>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Card Title"><Input value={highlights.liveWorkshop.title} onChange={e => updateHighlight('liveWorkshop', 'title', e.target.value)} /></Field>
                  <Field label="Badge"><Input value={highlights.liveWorkshop.badge} onChange={e => updateHighlight('liveWorkshop', 'badge', e.target.value)} /></Field>
                </div>
                <Field label="Topic Title"><Input value={highlights.liveWorkshop.topic} onChange={e => updateHighlight('liveWorkshop', 'topic', e.target.value)} /></Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Workshop Time"><Input value={highlights.liveWorkshop.time} onChange={e => updateHighlight('liveWorkshop', 'time', e.target.value)} /></Field>
                  <Field label="Button Text"><Input value={highlights.liveWorkshop.btnText} onChange={e => updateHighlight('liveWorkshop', 'btnText', e.target.value)} /></Field>
                </div>
              </div>
            )}

            {/* Streak */}
            {highlights.streak && (
              <div className="space-y-4 bg-slate-900/40 p-4 rounded-xl border border-slate-800">
                <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">Streak Counter Card</p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <Field label="Card Title"><Input value={highlights.streak.title} onChange={e => updateHighlight('streak', 'title', e.target.value)} /></Field>
                  </div>
                  <Field label="Value"><Input value={highlights.streak.value} onChange={e => updateHighlight('streak', 'value', e.target.value)} /></Field>
                </div>
              </div>
            )}
          </div>

          {/* Features Editor */}
          <div className="bg-[#151821] border border-slate-800 rounded-2xl p-6 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Heart className="w-5 h-5 text-red-500" /> Ecosystem Core Features
            </h2>
            <div className="space-y-4">
              {(data.features || []).map((feat: any, idx: number) => (
                <div key={idx} className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <Field label={`Feature ${idx + 1} Title`}><Input value={feat.title} onChange={e => updateFeature(idx, 'title', e.target.value)} /></Field>
                    </div>
                    <Field label="Lucide Icon Name"><Input value={feat.icon} onChange={e => updateFeature(idx, 'icon', e.target.value)} placeholder="Users, Target, etc." /></Field>
                  </div>
                  <Field label="Description"><Textarea value={feat.description} onChange={e => updateFeature(idx, 'description', e.target.value)} rows={2} /></Field>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Stats & Social Links */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Stats editor */}
          <div className="bg-[#151821] border border-slate-800 rounded-2xl p-6 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Users className="w-5 h-5 text-blue-500" /> Live Statistics
            </h2>
            <div className="space-y-4">
              {(data.stats || []).map((stat: any, idx: number) => (
                <div key={idx} className="bg-slate-900/20 p-3 rounded-xl border border-slate-800 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Stat Value"><Input value={stat.value} onChange={e => updateStat(idx, 'value', e.target.value)} /></Field>
                    <Field label="Icon Name"><Input value={stat.icon} onChange={e => updateStat(idx, 'icon', e.target.value)} /></Field>
                  </div>
                  <Field label="Label Text"><Input value={stat.label} onChange={e => updateStat(idx, 'label', e.target.value)} /></Field>
                </div>
              ))}
            </div>
          </div>

          {/* Social Links Editor */}
          <div className="bg-[#151821] border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-500" /> Social Channels
              </h2>
              <button onClick={addSocial} className="flex items-center gap-1 text-xs bg-slate-800 border border-slate-700 hover:bg-slate-700 px-2.5 py-1.5 rounded-lg text-slate-300 font-bold transition-all">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
            
            <div className="space-y-4">
              {(data.socials || []).map((social: any, idx: number) => (
                <div key={idx} className="bg-slate-900/40 p-3.5 rounded-xl border border-slate-800 space-y-2 relative group">
                  <button onClick={() => removeSocial(idx)} className="absolute top-2 right-2 text-slate-500 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <Field label="Platform Name"><Input value={social.label} onChange={e => updateSocial(idx, 'label', e.target.value)} /></Field>
                  <Field label="Profile/Invite URL"><Input value={social.href} onChange={e => updateSocial(idx, 'href', e.target.value)} /></Field>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <div className="mt-8 space-y-6">
        <VisualBlockManager
          sectionKey="community"
          title="Community Visuals & Collaboration CMS"
          subtitle="Manage illustrations, custom visual blocks, and interactive graphic panels shown to the community."
        />

        <VisualBlockManager
          sectionKey="mentorship"
          title="Mentorship Pillars & Cards CMS"
          subtitle="Customize the 4 core learning pillars (Project-First, AI-Native, Builder, Mentorship) dynamically."
        />
      </div>
    </div>
  );
}

