import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { WOMAC_SCALE } from '../data/womacItems';

export default function EmojiPainScale({ value, onChange }) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-5 gap-1.5">
      {WOMAC_SCALE.map((opt) => {
        const selected = value === opt.value;
        return (
          <motion.button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            whileTap={{ scale: 0.94 }}
            className={`flex flex-col items-center justify-center gap-1 rounded-ms py-2.5 border-[1.5px] transition-colors duration-150 ${
              selected
                ? 'bg-brand border-brand text-white shadow-ms-sm'
                : 'bg-white dark:bg-surface-dark-raised border-border dark:border-border-dark text-ink-muted dark:text-ink-dark-muted'
            }`}
          >
            <span className="text-2xl leading-none">{opt.emoji}</span>
            <span className="text-[10px] font-medium leading-none">{t(opt.i18nKey)}</span>
          </motion.button>
        );
      })}
    </div>
  );
}