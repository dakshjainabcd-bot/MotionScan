import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePatientSession } from '../context/usePatientSession';

const OCCUPATION_OPTIONS = ['jhum_farming', 'manual_labor', 'desk_work', 'other'];
const TERRAIN_OPTIONS = ['hilly', 'flat'];

function PillGroup({ options, value, onChange, labelPrefix, t }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const selected = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`px-3.5 py-2 rounded-ms text-sm font-medium border-[1.5px] transition-colors duration-150 ${
              selected
                ? 'bg-brand border-brand text-white'
                : 'bg-white dark:bg-surface-dark-raised border-border dark:border-border-dark text-ink-muted dark:text-ink-dark-muted'
            }`}
          >
            {t(`${labelPrefix}.${opt}`)}
          </button>
        );
      })}
    </div>
  );
}

function YesNoToggle({ value, onChange, t }) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`flex-1 py-2.5 rounded-ms text-sm font-semibold border-[1.5px] transition-colors duration-150 ${
          value === true
            ? 'bg-brand border-brand text-white'
            : 'bg-white dark:bg-surface-dark-raised border-border dark:border-border-dark text-ink-muted dark:text-ink-dark-muted'
        }`}
      >
        {t('riskFactors.yes')}
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`flex-1 py-2.5 rounded-ms text-sm font-semibold border-[1.5px] transition-colors duration-150 ${
          value === false
            ? 'bg-brand border-brand text-white'
            : 'bg-white dark:bg-surface-dark-raised border-border dark:border-border-dark text-ink-muted dark:text-ink-dark-muted'
        }`}
      >
        {t('riskFactors.no')}
      </button>
    </div>
  );
}

export default function RiskFactorForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setSession } = usePatientSession();

  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [occupationType, setOccupationType] = useState(null);
  const [terrain, setTerrain] = useState(null);
  const [previousInjury, setPreviousInjury] = useState(null);
  const [crepitus, setCrepitus] = useState(null);
  const [morningStiffness, setMorningStiffness] = useState(null);
  const [familyHistory, setFamilyHistory] = useState(null);

  const bmi = useMemo(() => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!h || !w) return null;
    const heightM = h / 100;
    return w / (heightM * heightM);
  }, [height, weight]);

  const isValid =
    bmi !== null &&
    occupationType !== null &&
    terrain !== null &&
    previousInjury !== null &&
    crepitus !== null &&
    morningStiffness !== null &&
    familyHistory !== null;

  const handleContinue = () => {
    if (!isValid) return;

    setSession((prev) => ({
      ...prev,
      bmi: Number(bmi.toFixed(1)),
      riskFactors: {
        heightCm: parseFloat(height),
        weightKg: parseFloat(weight),
        occupationType,
        hillyTerrain: terrain === 'hilly',
        previousKneeInjury: previousInjury,
        crepitusPresent: crepitus,
        morningStiffnessOver30min: morningStiffness,
        familyHistoryOA: familyHistory,
      },
    }));

    navigate('/session-summary');
  };

  return (
    <div className="max-w-lg mx-auto px-5 pt-8 pb-10 flex flex-col gap-5">
      <header>
        <h1 className="text-[22px] font-semibold tracking-[-0.3px] text-ink dark:text-ink-dark mb-1">
          {t('riskFactors.title')}
        </h1>
        <p className="text-sm text-ink-muted dark:text-ink-dark-muted">
          {t('riskFactors.subtitle')}
        </p>
      </header>

      <div className="bg-white dark:bg-surface-dark-raised border border-border dark:border-border-dark rounded-ms-lg px-5 py-5 shadow-ms-sm flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block mb-1.5 text-sm font-medium text-ink dark:text-ink-dark">
              {t('riskFactors.height')}
            </label>
            <input
              type="number"
              inputMode="decimal"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full border border-border dark:border-border-dark rounded-ms px-3 py-2 bg-transparent text-ink dark:text-ink-dark"
            />
          </div>
          <div>
            <label className="block mb-1.5 text-sm font-medium text-ink dark:text-ink-dark">
              {t('riskFactors.weight')}
            </label>
            <input
              type="number"
              inputMode="decimal"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full border border-border dark:border-border-dark rounded-ms px-3 py-2 bg-transparent text-ink dark:text-ink-dark"
            />
          </div>
        </div>

        {bmi !== null && (
          <div className="flex items-center justify-between rounded-ms bg-brand-soft dark:bg-surface-dark px-3.5 py-2.5">
            <span className="text-sm font-medium text-ink dark:text-ink-dark">{t('riskFactors.bmi')}</span>
            <span className="text-sm font-mono font-semibold text-brand dark:text-brand-dark">{bmi.toFixed(1)}</span>
          </div>
        )}

        <div>
          <p className="mb-2 text-sm font-medium text-ink dark:text-ink-dark">{t('riskFactors.occupation')}</p>
          <PillGroup options={OCCUPATION_OPTIONS} value={occupationType} onChange={setOccupationType} labelPrefix="riskFactors.occupationOptions" t={t} />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-ink dark:text-ink-dark">{t('riskFactors.terrain')}</p>
          <PillGroup options={TERRAIN_OPTIONS} value={terrain} onChange={setTerrain} labelPrefix="riskFactors.terrainOptions" t={t} />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-ink dark:text-ink-dark">{t('riskFactors.previousInjury')}</p>
          <YesNoToggle value={previousInjury} onChange={setPreviousInjury} t={t} />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-ink dark:text-ink-dark">{t('riskFactors.crepitus')}</p>
          <YesNoToggle value={crepitus} onChange={setCrepitus} t={t} />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-ink dark:text-ink-dark">{t('riskFactors.morningStiffness')}</p>
          <YesNoToggle value={morningStiffness} onChange={setMorningStiffness} t={t} />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-ink dark:text-ink-dark">{t('riskFactors.familyHistory')}</p>
          <YesNoToggle value={familyHistory} onChange={setFamilyHistory} t={t} />
        </div>
      </div>

      <button
        type="button"
        disabled={!isValid}
        onClick={handleContinue}
        className="w-full py-3.5 rounded-ms font-semibold text-[15px] text-white bg-brand disabled:bg-border-strong disabled:text-ink-faint active:scale-[0.98] transition-all"
      >
        {t('riskFactors.continue')}
      </button>
    </div>
  );
}
