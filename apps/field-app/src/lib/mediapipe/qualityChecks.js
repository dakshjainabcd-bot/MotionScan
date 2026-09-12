import { LM, REQUIRED_LANDMARKS_FOR_GAIT, VISIBILITY_THRESHOLD } from '../constants/landmarkIndices';

export function checkFullBodyVisible(landmarks) {
  if (!landmarks) return false;
  return REQUIRED_LANDMARKS_FOR_GAIT.every(
    (idx) => (landmarks[idx]?.visibility ?? 0) >= VISIBILITY_THRESHOLD
  );
}

export function checkSideViewOrientation(landmarks) {
  if (!landmarks) return false;
  const points = [LM.LEFT_SHOULDER, LM.LEFT_HIP, LM.LEFT_KNEE, LM.LEFT_ANKLE].map(
    (i) => landmarks[i]
  );
  if (points.some((p) => !p)) return false;
  const xs = points.map((p) => p.x);
  const spread = Math.max(...xs) - Math.min(...xs);
  return spread < 0.15;
}

export function checkCorrectDistance(landmarks) {
  if (!landmarks) return false;
  const shoulder = landmarks[LM.LEFT_SHOULDER];
  const ankle = landmarks[LM.LEFT_ANKLE];
  if (!shoulder || !ankle) return false;
  const bodyHeightFraction = Math.abs(ankle.y - shoulder.y);
  return bodyHeightFraction > 0.45 && bodyHeightFraction < 0.85;
}

export function checkAdequateLighting(canvasCtx, width, height) {
  if (!canvasCtx) return false;
  const frame = canvasCtx.getImageData(0, 0, width, height).data;
  let total = 0;
  let samples = 0;
  for (let i = 0; i < frame.length; i += 4 * 50) {
    total += (frame[i] + frame[i + 1] + frame[i + 2]) / 3;
    samples++;
  }
  return samples > 0 && total / samples > 60;
}

export function checkCameraStationary(prevLandmarks, currLandmarks) {
  if (!prevLandmarks || !currLandmarks) return true;
  const idx = LM.LEFT_HIP;
  if (!prevLandmarks[idx] || !currLandmarks[idx]) return true;
  const dx = Math.abs(prevLandmarks[idx].x - currLandmarks[idx].x);
  const dy = Math.abs(prevLandmarks[idx].y - currLandmarks[idx].y);
  return dx < 0.02 && dy < 0.02;
}

export function runAllQualityChecks({ landmarks, prevLandmarks, canvasCtx, width, height }) {
  const checks = [
    {
      id: 'fullBody',
      label: 'Full body visible',
      pass: checkFullBodyVisible(landmarks),
      instruction: 'Step back so your ankles, knees, hips and shoulders are all in frame.',
    },
    {
      id: 'sideView',
      label: 'Side-on orientation',
      pass: checkSideViewOrientation(landmarks),
      instruction: 'Turn to stand side-on to the camera, not facing it directly.',
    },
    {
      id: 'distance',
      label: 'Correct distance',
      pass: checkCorrectDistance(landmarks),
      instruction: 'Move about 3 metres from the camera.',
    },
    {
      id: 'lighting',
      label: 'Adequate lighting',
      pass: checkAdequateLighting(canvasCtx, width, height),
      instruction: 'Move to a brighter spot or turn on more light.',
    },
    {
      id: 'stationary',
      label: 'Camera steady',
      pass: checkCameraStationary(prevLandmarks, landmarks),
      instruction: 'Hold the phone still against a wall or stand, or use a tripod.',
    },
  ];

  const allPass = checks.every((c) => c.pass);
  const firstFailure = checks.find((c) => !c.pass);

  return { checks, allPass, activeInstruction: firstFailure?.instruction ?? null };
}