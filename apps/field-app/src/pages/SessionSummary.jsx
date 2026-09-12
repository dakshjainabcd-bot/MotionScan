import { usePatientSession } from '../context/usePatientSession';

export default function SessionSummary() {
  const { session } = usePatientSession();

  return (
    <div className="max-w-lg mx-auto px-5 pt-8 pb-10 flex flex-col gap-5">
      <header>
        <h1 className="text-[22px] font-semibold tracking-[-0.3px] text-ink dark:text-ink-dark mb-1">
          Screening data captured
        </h1>
        <p className="text-sm text-ink-muted dark:text-ink-dark-muted">
          Temporary developer view — the real LOW / REVIEW / HIGH result screen
          is built in Phase 9 once the Risk Fusion Engine exists.
        </p>
      </header>

      <div className="bg-white dark:bg-surface-dark-raised border border-border dark:border-border-dark rounded-ms-lg px-5 py-5 shadow-ms-sm">
        <pre className="text-xs text-ink-muted dark:text-ink-dark-muted whitespace-pre-wrap break-words font-mono">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
    </div>
  );
}
