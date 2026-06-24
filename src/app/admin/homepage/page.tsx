"use client";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, RefreshCw, Home } from 'lucide-react';
import { Field, Input, Textarea } from '@/components/admin/FormModal';

import VisualBlockManager from '@/components/admin/VisualBlockManager';

export default function AdminHomepage() {
  const [config, setConfig] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/site-config').then(r => r.json()).then(d => { setConfig(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const update = (path: string[], value: string) => {
    setConfig((prev: any) => {
      const next = { ...prev };
      let cur: any = next;
      for (let i = 0; i < path.length - 1; i++) { cur[path[i]] = { ...cur[path[i]] }; cur = cur[path[i]]; }
      cur[path[path.length - 1]] = value;
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/site-config', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(config) });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return <div className="p-8 text-slate-400 animate-pulse">Loading configuration...</div>;
  if (!config) return <div className="p-8 text-red-500">Failed to load config.</div>;

  const hero = config.hero || {};

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Homepage Editor</h1>
          <p className="text-slate-500 mt-1">Edit the hero section, CTAs, and stats shown on the homepage.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-5 py-2.5 font-bold rounded-xl shadow-md transition-all ${saved ? 'bg-green-500 text-white' : 'bg-gradient-to-r from-orange-500 to-red-500 text-white'} disabled:opacity-60`}
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </motion.button>
      </div>

      <div className="space-y-6">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
            <Home className="w-5 h-5 text-orange-500" /> Hero Section & Visual Assets
          </h2>
          <div className="space-y-4">
            <Field label="Badge Text"><Input value={hero.badge || ''} onChange={e => update(['hero', 'badge'], e.target.value)} placeholder="Welcome to DevPhoenix Ecosystem" /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Headline Line 1"><Input value={hero.headline1 || ''} onChange={e => update(['hero', 'headline1'], e.target.value)} placeholder="Learn. Grow." /></Field>
              <Field label="Headline Line 2 (gradient)"><Input value={hero.headline2 || ''} onChange={e => update(['hero', 'headline2'], e.target.value)} placeholder="Succeed." /></Field>
            </div>
            <Field label="Sub-headline"><Textarea value={hero.subheadline || ''} onChange={e => update(['hero', 'subheadline'], e.target.value)} rows={2} /></Field>
            
            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
              <Field label="Primary CTA Text"><Input value={hero.primaryCta?.text || ''} onChange={e => update(['hero', 'primaryCta', 'text'], e.target.value)} /></Field>
              <Field label="Primary CTA Link"><Input value={hero.primaryCta?.href || ''} onChange={e => update(['hero', 'primaryCta', 'href'], e.target.value)} /></Field>
              <Field label="Secondary CTA Text"><Input value={hero.secondaryCta?.text || ''} onChange={e => update(['hero', 'secondaryCta', 'text'], e.target.value)} /></Field>
              <Field label="Secondary CTA Link"><Input value={hero.secondaryCta?.href || ''} onChange={e => update(['hero', 'secondaryCta', 'href'], e.target.value)} /></Field>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
              <Field label="Mascot Image URL"><Input value={hero.mascotImage || ''} onChange={e => update(['hero', 'mascotImage'], e.target.value)} placeholder="/learning.png" /></Field>
              <Field label="Hero Glow Background Color"><Input value={hero.glowColor || ''} onChange={e => update(['hero', 'glowColor'], e.target.value)} placeholder="orange" /></Field>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-100">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Floating Cards Configuration</p>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Card 1 Title"><Input value={hero.floatingCard1Title || ''} onChange={e => update(['hero', 'floatingCard1Title'], e.target.value)} placeholder="Your Journey" /></Field>
                <Field label="Card 1 Status"><Input value={hero.floatingCard1Status || ''} onChange={e => update(['hero', 'floatingCard1Status'], e.target.value)} placeholder="In Progress" /></Field>
                <Field label="Card 2 Label"><Input value={hero.floatingCard2Label || ''} onChange={e => update(['hero', 'floatingCard2Label'], e.target.value)} placeholder="Next Milestone" /></Field>
                <Field label="Card 2 Content"><Input value={hero.floatingCard2Content || ''} onChange={e => update(['hero', 'floatingCard2Content'], e.target.value)} placeholder="Build Your First Project" /></Field>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-lg font-extrabold text-slate-900 mb-4">Hero Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            {(hero.stats || []).map((stat: any, i: number) => (
              <div key={i} className="flex gap-3">
                <div className="flex-1">
                  <Field label={`Stat ${i + 1} Value`}>
                    <Input value={stat.value} onChange={e => { const s = [...hero.stats]; s[i] = { ...s[i], value: e.target.value }; update(['hero', 'stats'], s as any); }} />
                  </Field>
                </div>
                <div className="flex-1">
                  <Field label="Label">
                    <Input value={stat.label} onChange={e => { const s = [...hero.stats]; s[i] = { ...s[i], label: e.target.value }; update(['hero', 'stats'], s as any); }} />
                  </Field>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-lg font-extrabold text-slate-900 mb-4">Contact Info</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Email"><Input value={config.contact?.email || ''} onChange={e => update(['contact', 'email'], e.target.value)} /></Field>
            <Field label="Phone"><Input value={config.contact?.phone || ''} onChange={e => update(['contact', 'phone'], e.target.value)} /></Field>
          </div>
        </div>

        {/* Socials */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-lg font-extrabold text-slate-900 mb-4">Social Links</h2>
          <div className="space-y-3">
            {['instagram', 'linkedin', 'facebook', 'twitter', 'github'].map(social => (
              <Field key={social} label={social.charAt(0).toUpperCase() + social.slice(1)}>
                <Input value={config.socials?.[social] || ''} onChange={e => update(['socials', social], e.target.value)} placeholder={`https://${social}.com/...`} />
              </Field>
            ))}
          </div>
        </div>

        {/* Visual Blocks Editors */}
        <VisualBlockManager
          sectionKey="hero"
          title="Hero Visuals & Floating Cards CMS"
          subtitle="Add, remove, reorder or replace mascot files and floating details cards in real-time."
        />

        <VisualBlockManager
          sectionKey="journey"
          title="Learning Journey Timeline & Roadmaps CMS"
          subtitle="Customize transformation timeline roadmaps and floating laptop graphics for students."
        />
      </div>
    </div>
  );
}

