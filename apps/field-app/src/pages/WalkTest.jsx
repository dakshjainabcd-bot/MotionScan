import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CameraPreview from '../components/CameraPreview';
import SkeletonOverlay from '../components/SkeletonOverlay';
import { getPoseLandmarker, detectFrame } from '../lib/mediapipe/poseLandmarker';
import { extractGaitFeatures } from '../lib/mediapipe/gaitFeatureExtraction';
import { usePatientSession } from '../context/usePatientSession';

const TRIAL_SECONDS = 8;

export default function WalkTest() {
  const cameraRef = useRef(null);
  const landmarkerRef = useRef(null);
  const seriesRef = useRef([]);
  const phaseRef = useRef('idle');

  const [landmarks, setLandmarks] = useState(null);
  const [videoDims, setVideoDims] = useState({ width: 320, height: 240 });
  const [cameraError, setCameraError] = useState(null);
  const [phase, setPhase] = useState('idle');
  const [secondsLeft, setSecondsLeft] = useState(TRIAL_SECONDS);
  const [features, setFeatures] = useState(null);

  const navigate = useNavigate();
  const { setSession } = usePatientSession();

  const handleFrame = useCallback((videoEl) => {
    if (
      videoEl.videoWidth &&
      videoEl.videoHeight &&
      (videoEl.videoWidth !== videoDims.width || videoEl.videoHeight !== videoDims.height)
    ) {
      setVideoDims({ width: videoEl.videoWidth, height: videoEl.videoHeight });
    }

    (async () => {
      if (!landmarkerRef.current) {
        landmarkerRef.current = await getPoseLandmarker();
      }
      const detection = detectFrame(landmarkerRef.current, videoEl, performance.now());
      const current = detection?.landmarks?.[0] ?? null;
      setLandmarks(current);
      if (phaseRef.current === 'recording' && current) {
        seriesRef.current.push(current);
      }
    })();
  }, [videoDims]);

  const finishTrial = useCallback(() => {
    const extracted = extractGaitFeatures(seriesRef.current, 30);
    setFeatures(extracted);
    setSession((prev) => ({ ...prev, gaitFeatures: extracted }));
    phaseRef.current = 'done';
    setPhase('done');
  }, [setSession]);

  const startTrial = () => {
    seriesRef.current = [];
    phaseRef.current = 'recording';
    setPhase('recording');
    setSecondsLeft(TRIAL_SECONDS);

    const tick = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(tick);
          finishTrial();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  return (
    <div className="max-w-lg mx-auto px-5 pt-8 pb-10 flex flex-col gap-5">
      <header>
        <h1 className="text-[22px] font-semibold tracking-[-0.3px] text-ink dark:text-ink-dark mb-1">
          Walking trial
        </h1>
        <p className="text-sm text-ink-muted dark:text-ink-dark-muted">
          Walk 6–8 metres in a straight line, side-on to the camera.
        </p>
      </header>

      <div className="relative">
        <CameraPreview ref={cameraRef} onError={setCameraError} onFrame={handleFrame}>
          <SkeletonOverlay
            landmarks={landmarks}
            width={videoDims.width}
            height={videoDims.height}
            quality={phase === 'recording' ? 'good' : 'ok'}
          />
        </CameraPreview>

        {phase === 'recording' && (
          <motion.div
            className="absolute top-3.5 right-3.5 bg-black/80 text-white font-mono text-[13px] px-3 py-1.5 rounded-full backdrop-blur-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {secondsLeft}s
          </motion.div>
        )}
      </div>

      {cameraError && (
        <p className="text-state-bad text-sm">
          Camera access failed: {cameraError}. Check browser permissions and try again.
        </p>
      )}

      {phase === 'idle' && (
        <button
          type="button"
          onClick={startTrial}
          className="w-full py-3.5 rounded-ms font-semibold text-[15px] text-white bg-brand active:scale-[0.98] transition-all"
        >
          Start recording
        </button>
      )}

      {phase === 'recording' && (
        <div className="bg-white dark:bg-surface-dark-raised border border-border dark:border-border-dark rounded-ms px-4.5 py-3 shadow-ms-sm">
          <p className="text-ink-muted text-sm">Recording… keep walking in view of the camera.</p>
        </div>
      )}

      {phase === 'done' && (
        <>
          <div className="bg-white dark:bg-surface-dark-raised border border-border dark:border-border-dark rounded-ms px-4.5 py-4 shadow-ms-sm">
            <h3 className="text-[15px] font-semibold text-ink dark:text-ink-dark mb-3">Trial complete</h3>
            {features ? (
              <ul className="flex flex-col gap-2">
                {[
                  ['Cadence', features.cadence != null ? `${features.cadence.toFixed(0)} steps/min` : '—'],
                  ['Walking speed', features.walkingSpeed != null ? `${features.walkingSpeed.toFixed(2)} units/s` : '—'],
                  ['Symmetry index', features.symmetryIndex != null ? features.symmetryIndex.toFixed(2) : '—'],
                  ['Trunk lean', features.trunkLean != null ? features.trunkLean.toFixed(1) : '—'],
                ].map(([label, value]) => (
                  <li key={label} className="flex justify-between text-sm">
                    <span className="text-ink-muted">{label}</span>
                    <span className="font-mono font-semibold text-[13px] text-ink dark:text-ink-dark">{value}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-ink-muted text-sm">Trial too short — please try again.</p>
            )}
          </div>

          <button
            type="button"
            onClick={() => navigate('/womac')}
            disabled={!features}
            className="w-full py-3.5 rounded-ms font-semibold text-[15px] text-white bg-brand disabled:bg-border-strong disabled:text-ink-faint active:scale-[0.98] transition-all"
          >
            Continue
          </button>
          <button
            type="button"
            onClick={startTrial}
            className="w-full py-3 rounded-ms font-medium text-sm text-ink dark:text-ink-dark border border-border-strong dark:border-border-dark"
          >
            Repeat trial
          </button>
        </>
      )}
    </div>
  );
}