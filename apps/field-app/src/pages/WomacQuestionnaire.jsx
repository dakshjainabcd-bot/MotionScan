import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { WOMAC_ITEMS } from '../data/womacItems';
import EmojiPainScale from '../components/EmojiPainScale';
import { usePatientSession } from '../context/usePatientSession';

export default function WomacQuestionnaire() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session, setSession } = usePatientSession();

  const [responses, setResponses] = useState(session.womacResponses || {});
  const [stepIndex, setStepIndex] = useState(0);

  const currentItem = WOMAC_ITEMS[stepIndex];
  const isLastItem = stepIndex === WOMAC_ITEMS.length - 1;
  const progressPct = ((stepIndex + 1) / WOMAC_ITEMS.length) * 100;

  const finishQuestionnaire = (finalResponses) => {
    const subscores = { pain: 0, stiffness: 0, function: 0 };
    const counts = { pain: 0, stiffness: 0, function: 0 };

    WOMAC_ITEMS.forEach((item) => {
      const val = finalResponses[item.id];
      if (val !== undefined) {
        subscores[item.domain] += val;
        counts[item.domain] += 1;
      }
    });

    Object.keys(subscores).forEach((domain) => {
      subscores[domain] = counts[domain] > 0 ? subscores[domain] / counts[domain] : null;
    });

    setSession((prev) => ({
      ...prev,
      womacResponses: finalResponses,
      womacSubscores: subscores,
    }));

    navigate('/risk-factors');
  };

  const handleAnswer = (value) => {
    const next = { ...responses, [currentItem.id]: value };
    setResponses(next);

    // Small delay so the tap animation is visible before advancing.
    window.setTimeout(() => {
      if (isLastItem) {
        finishQuestionnaire(next);
      } else {
        setStepIndex((i) => i + 1);
      }
    }, 180);
  };

  const handleBack = () => {
    if (stepIndex === 0) {
      navigate('/walk-test');
      return;
    }
    setStepIndex((i) => i - 1);
  };

  return (
    <div className="max-w-lg mx-auto px-5 pt-8 pb-10 flex flex-col gap-5">
      <header>
        <h1 className="text-[22px] font-semibold tracking-[-0.3px] text-ink dark:text-ink-dark mb-1">
          {t('womac.title')}
        </h1>
        <p className="text-sm text-ink-muted dark:text-ink-dark-muted">
          {t('womac.subtitle')}
        </p>
      </header>

      <div>
        <div className="h-1.5 w-full rounded-full bg-border dark:bg-border-dark overflow-hidden">
          <motion.div
            className="h-full bg-brand rounded-full"
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <p className="text-xs text-ink-faint mt-1.5">
          {t('womac.progress', { current: stepIndex + 1, total: WOMAC_ITEMS.length })}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.id}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white dark:bg-surface-dark-raised border border-border dark:border-border-dark rounded-ms-lg px-5 py-6 shadow-ms-md flex flex-col gap-5"
        >
          <p className="text-[17px] font-medium text-ink dark:text-ink-dark leading-snug">
            {t(currentItem.i18nKey)}
          </p>
          <EmojiPainScale value={responses[currentItem.id]} onChange={handleAnswer} />
        </motion.div>
      </AnimatePresence>

      <button
        type="button"
        onClick={handleBack}
        className="text-sm font-medium text-ink-muted dark:text-ink-dark-muted self-start"
      >
        ← {t('riskFactors.back')}
      </button>
    </div>
  );
}
