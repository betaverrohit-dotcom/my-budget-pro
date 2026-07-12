import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  dark?: boolean;
}

export function SectionCard({ title, subtitle, action, children, dark = false }: SectionCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-3xl border p-5 shadow-sm ${dark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white'}`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className={`text-lg font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>{title}</h2>
          {subtitle ? <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </motion.section>
  );
}
