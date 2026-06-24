"use client";
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: 'orange' | 'blue' | 'green' | 'purple';
}

const colorMap = {
  orange: { bg: 'bg-orange-50', icon: 'text-orange-500', ring: 'ring-orange-100' },
  blue: { bg: 'bg-blue-50', icon: 'text-blue-500', ring: 'ring-blue-100' },
  green: { bg: 'bg-green-50', icon: 'text-green-500', ring: 'ring-green-100' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-500', ring: 'ring-purple-100' },
};

export default function StatCard({ label, value, icon: Icon, trend, color = 'orange' }: StatCardProps) {
  const c = colorMap[color];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: '0 12px 32px rgba(0,0,0,0.08)' }}
      className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${c.bg} ring-1 ${c.ring} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${c.icon}`} />
        </div>
        {trend && <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">{trend}</span>}
      </div>
      <p className="text-3xl font-extrabold text-slate-900 mb-1">{value}</p>
      <p className="text-sm text-slate-500 font-medium">{label}</p>
    </motion.div>
  );
}
