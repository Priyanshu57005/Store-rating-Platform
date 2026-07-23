import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description?: string;
  gradient: 'indigo' | 'emerald' | 'amber' | 'purple';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  description,
  gradient,
}) => {
  const gradientStyles = {
    indigo: 'from-indigo-500/20 to-indigo-600/5 text-indigo-400 border-indigo-500/30',
    emerald: 'from-emerald-500/20 to-emerald-600/5 text-emerald-400 border-emerald-500/30',
    amber: 'from-amber-500/20 to-amber-600/5 text-amber-400 border-amber-500/30',
    purple: 'from-violet-500/20 to-violet-600/5 text-violet-400 border-violet-500/30',
  };

  return (
    <div className="glass-card p-6 border relative overflow-hidden group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
          {description && <p className="text-xs text-zinc-400 mt-1.5">{description}</p>}
        </div>
        <div className={`p-3.5 rounded-xl bg-gradient-to-br border ${gradientStyles[gradient]} group-hover:scale-105 transition-transform duration-200`}>
          {icon}
        </div>
      </div>
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-xl pointer-events-none" />
    </div>
  );
};
