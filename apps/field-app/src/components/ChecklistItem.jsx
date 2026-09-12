import { motion } from 'framer-motion';
import { Check, X, Circle } from 'lucide-react';

const STATUS_CONFIG = {
  pending: { bg: 'bg-white', border: 'border-border-strong', icon: null },
  pass: { bg: 'bg-state-good', border: 'border-state-good', icon: <Check size={13} color="#fff" strokeWidth={3} /> },
  fail: { bg: 'bg-white', border: 'border-border-strong', icon: <X size={11} className="text-ink-faint" strokeWidth={2.5} /> },
};

export default function ChecklistItem({ label, status = 'pending' }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;

  return (
    <motion.div layout className="flex items-center gap-2.5 py-2.5 px-1">
      <motion.span
        layout
        className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center shrink-0 transition-colors duration-200 ${cfg.bg} ${cfg.border}`}
      >
        {cfg.icon ?? <Circle size={6} className="text-ink-faint" fill="currentColor" />}
      </motion.span>
      <span className={`text-sm transition-colors duration-200 ${status === 'pass' ? 'text-ink font-medium' : 'text-ink-muted'}`}>
        {label}
      </span>
    </motion.div>
  );
}