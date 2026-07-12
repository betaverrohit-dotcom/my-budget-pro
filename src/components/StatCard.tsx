import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  accent: string;
  subtitle?: string;
  dark?: boolean;
}

export function StatCard({ icon: Icon, label, value, accent, subtitle, dark = false }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      className={`rounded-3xl border p-5 shadow-sm ${dark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white'}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</p>
          <p className={`mt-2 text-2xl font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>{value}</p>
        </div>
        <div className={`rounded-2xl p-3 ${accent}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {subtitle ? <p className={`mt-4 text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{subtitle}</p> : null}
    </motion.div>
  );
}
