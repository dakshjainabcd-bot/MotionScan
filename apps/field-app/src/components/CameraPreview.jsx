import { forwardRef, useEffect, useImperativeHandle, useRef, useState, useCallback } from 'react';

/**
 * Prefer a device whose label contains "DroidCam" (case-insensitive).
 * Falls back to the first available device, never uses facingMode which
 * doesn't help on desktops and ignores virtual cameras entirely.
 */
function pickPreferredDevice(devices) {
  const droidcam = devices.find((d) =>
    d.label.toLowerCase().includes('droidcam')
  );
  return droidcam ?? devices[0] ?? null;
}

const CameraPreview = forwardRef(function CameraPreview({ onError, onFrame, children }, ref) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);

  const [ready, setReady] = useState(false);
  const [devices, setDevices] = useState([]);
  const [activeDeviceId, setActiveDeviceId] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  useImperativeHandle(ref, () => ({
    getVideoElement: () => videoRef.current,
  }));

  // ── Enumerate cameras after permission is granted ──────────────────────────
  const enumerateDevices = useCallback(async () => {
    const all = await navigator.mediaDevices.enumerateDevices();
    const cams = all.filter((d) => d.kind === 'videoinput');
    setDevices(cams);
    return cams;
  }, []);

  // ── Open a stream for a specific deviceId ─────────────────────────────────
  const startStream = useCallback(async (deviceId) => {
    // Stop any existing stream first
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setReady(false);

    try {
      const constraints = {
        video: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setReady(true);
        setActiveDeviceId(deviceId);
      }
    } catch (err) {
      onError?.(err.message || 'Unknown camera error');
    }
  }, [onError]);

  // ── Initial bootstrap ──────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      // First call without deviceId to trigger the permission prompt
      try {
        const tempStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        tempStream.getTracks().forEach((t) => t.stop()); // release immediately
      } catch (err) {
        onError?.(err.message || 'Camera permission denied');
        return;
      }

      if (cancelled) return;

      const cams = await enumerateDevices();
      if (cancelled || cams.length === 0) return;

      const preferred = pickPreferredDevice(cams);
      await startStream(preferred?.deviceId ?? null);
    }

    bootstrap();

    // rAF loop – feeds frames to the consumer (pose detection, etc.)
    function loop() {
      if (videoRef.current && videoRef.current.readyState >= 2) {
        onFrame?.(videoRef.current);
      }
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Switch camera from the picker ─────────────────────────────────────────
  const handleSwitch = async (deviceId) => {
    setShowPicker(false);
    await startStream(deviceId);
  };

  // ── Active device label for the button ────────────────────────────────────
  const activeLabel = devices.find((d) => d.deviceId === activeDeviceId)?.label || 'Camera';

  return (
    <div className="relative w-full max-w-[480px] mx-auto aspect-[9/16] rounded-ms-lg overflow-hidden bg-black shadow-ms-lg">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover scale-x-[-1]"
      />

      {ready && children}

      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center text-white text-sm bg-black/50 px-6 text-center">
          Starting camera…
        </div>
      )}

      {/* Camera-switch button — only shown when >1 camera exists */}
      {devices.length > 1 && ready && (
        <button
          type="button"
          onClick={() => setShowPicker((v) => !v)}
          className="absolute top-3 left-3 bg-black/70 text-white text-[11px] px-2.5 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1.5 leading-none"
          title="Switch camera"
        >
          {/* simple camera icon */}
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
          <span className="max-w-[120px] truncate">{activeLabel.replace(/\s*\(.*\)$/, '')}</span>
        </button>
      )}

      {/* Device picker dropdown */}
      {showPicker && (
        <div className="absolute top-12 left-3 bg-black/90 backdrop-blur-md rounded-ms text-white text-[13px] py-1.5 min-w-[200px] max-w-[90%] z-10 shadow-ms-lg">
          {devices.map((d) => (
            <button
              key={d.deviceId}
              type="button"
              onClick={() => handleSwitch(d.deviceId)}
              className={`w-full text-left px-4 py-2.5 hover:bg-white/10 transition-colors truncate ${
                d.deviceId === activeDeviceId ? 'text-brand-dark font-medium' : ''
              }`}
            >
              {d.label || `Camera ${devices.indexOf(d) + 1}`}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

export default CameraPreview;