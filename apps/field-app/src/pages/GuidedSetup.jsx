import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import CameraPreview from '../components/CameraPreview';
import SkeletonOverlay from '../components/SkeletonOverlay';
import ChecklistItem from '../components/ChecklistItem';
import { getPoseLandmarker, detectFrame } from '../lib/mediapipe/poseLandmarker';
import { runAllQualityChecks } from '../lib/mediapipe/qualityChecks';
import { usePatientSession } from '../context/usePatientSession';

export default function GuidedSetup() {
  const cameraRef = useRef(null);
  const hiddenCanvasRef = useRef(document.createElement('canvas'));
  const prevLandmarksRef = useRef(null);
  const landmarkerRef = useRef(null);

  const [landmarks, setLandmarks] = useState(null);
  const [videoDims, setVideoDims] = useState({ width: 320, height: 240 });
  const [cameraError, setCameraError] = useState(null);
  const [result, setResult] = useState({ checks: [], allPass: false, activeInstruction: null });
  const [modelLoading, setModelLoading] = useState(true);

  const navigate = useNavigate();
  const { session, setSession } = usePatientSession();

  useEffect(() => {
    getPoseLandmarker().then((lm) => {
      landmarkerRef.current = lm;
      setModelLoading(false);
    });
  }, []);

  const handleFrame = useCallback((videoEl) => {
    if (!landmarkerRef.current) return;

    // Safe here — this runs inside a callback, not during render.
    if (
      videoEl.videoWidth &&
      videoEl.videoHeight &&
      (videoEl.videoWidth !== videoDims.width || videoEl.videoHeight !== videoDims.height)
    ) {
      setVideoDims({ width: videoEl.videoWidth, height: videoEl.videoHeight });
    }

    const detection = detectFrame(landmarkerRef.current, videoEl, performance.now());
    const currentLandmarks = detection?.landmarks?.[0] ?? null;

    const canvas = hiddenCanvasRef.current;
    canvas.width = videoEl.videoWidth || 320;
    canvas.height = videoEl.videoHeight || 240;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);

    const qualityResult = runAllQualityChecks({
      landmarks: currentLandmarks,
      prevLandmarks: prevLandmarksRef.current,
      canvasCtx: ctx,
      width: canvas.width,
      height: canvas.height,
    });

    prevLandmarksRef.current = currentLandmarks;
    setLandmarks(currentLandmarks);
    setResult(qualityResult);
  }, [videoDims]);

  const handleContinue = () => {
    setSession((prev) => ({ ...prev, guidedSetupComplete: true }));
    navigate('/walk-test');
  };

  return (
    <div className="max-w-lg mx-auto px-5 pt-8 pb-10 flex flex-col gap-5">
      <header>
        <h1 className="text-[22px] font-semibold tracking-[-0.3px] text-ink dark:text-ink-dark mb-1">
          Position the patient
        </h1>
        <p className="text-sm text-ink-muted dark:text-ink-dark-muted">
          Stand the patient side-on, about 3 metres from the camera.
        </p>
      </header>

      <div className="relative">
        <CameraPreview ref={cameraRef} onError={setCameraError} onFrame={handleFrame}>
          <SkeletonOverlay
            landmarks={landmarks}
            width={videoDims.width}
            height={videoDims.height}
            quality={result.allPass ? 'good' : 'warn'}
          />
        </CameraPreview>

        <AnimatePresence>
          {result.activeInstruction && !modelLoading && (
            <motion.div
              className="absolute left-1/2 bottom-4 -translate-x-1/2 bg-black/80 text-white text-[13px] px-4 py-2.5 rounded-full backdrop-blur-md whitespace-nowrap max-w-[90%] overflow-hidden text-ellipsis"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {result.activeInstruction}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {cameraError && (
        <p className="text-state-bad text-sm">
          Camera access failed: {cameraError}. Check browser permissions and try again.
        </p>
      )}

      <div className="bg-white dark:bg-surface-dark-raised border border-border dark:border-border-dark rounded-ms px-4.5 py-3 shadow-ms-sm">
        {modelLoading ? (
          <p className="text-ink-muted text-sm">Loading pose model…</p>
        ) : (
          result.checks.map((c) => (
            <ChecklistItem key={c.id} label={c.label} status={c.pass ? 'pass' : 'fail'} />
          ))
        )}
      </div>

      <p className="text-xs text-ink-faint">
        Patient: <strong className="text-ink-muted">{session.name || '—'}</strong> · District:{' '}
        <strong className="text-ink-muted">{session.district || '—'}</strong>
      </p>

      <button
        type="button"
        disabled={!result.allPass}
        onClick={handleContinue}
        className="w-full py-3.5 rounded-ms font-semibold text-[15px] text-white bg-brand disabled:bg-border-strong disabled:text-ink-faint active:scale-[0.98] transition-all"
      >
        {result.allPass ? 'Start walking trial' : 'Waiting for good positioning…'}
      </button>
    </div>
  );
}