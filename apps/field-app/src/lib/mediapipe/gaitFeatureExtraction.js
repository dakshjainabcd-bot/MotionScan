import { LM } from '../constants/landmarkIndices';

export function extractGaitFeatures(landmarkSeries, fps = 30) {
  if (!landmarkSeries || landmarkSeries.length < fps) {
    return null;
  }

  const ankleY = landmarkSeries.map((f) => f[LM.LEFT_ANKLE]?.y ?? null);
  const hipX = landmarkSeries.map((f) => f[LM.LEFT_HIP]?.x ?? null);
  const shoulderX = landmarkSeries.map((f) => f[LM.LEFT_SHOULDER]?.x ?? null);

  const strideEvents = detectStrideEvents(ankleY);
  const durationSec = landmarkSeries.length / fps;

  const cadence = durationSec > 0 ? (strideEvents.length / durationSec) * 60 : 0;
  const strideLength = averageStrideLength(hipX, strideEvents);
  const walkingSpeed = computeWalkingSpeed(hipX, durationSec);
  const symmetryIndex = computeSymmetryIndex(strideEvents, fps);
  const trunkLean = averageTrunkLean(shoulderX, hipX);
  const kneeAngleRangeCoarse = coarseKneeROM(landmarkSeries);

  return {
    strideLength,
    cadence,
    walkingSpeed,
    symmetryIndex,
    trunkLean,
    kneeAngleRangeCoarse,
    frameCount: landmarkSeries.length,
    durationSec,
  };
}

function detectStrideEvents(ankleYSeries) {
  const events = [];
  const valid = ankleYSeries.filter((y) => y != null);
  if (valid.length < 5) return events;

  for (let i = 2; i < ankleYSeries.length - 2; i++) {
    const y = ankleYSeries[i];
    if (y == null) continue;
    const window = [ankleYSeries[i - 2], ankleYSeries[i - 1], ankleYSeries[i + 1], ankleYSeries[i + 2]];
    if (window.every((w) => w != null && y >= w)) {
      events.push(i);
    }
  }
  return events;
}

function averageStrideLength(hipXSeries, events) {
  if (events.length < 2) return null;
  let total = 0;
  let count = 0;
  for (let i = 1; i < events.length; i++) {
    const a = hipXSeries[events[i - 1]];
    const b = hipXSeries[events[i]];
    if (a != null && b != null) {
      total += Math.abs(b - a);
      count++;
    }
  }
  return count > 0 ? total / count : null;
}

function computeWalkingSpeed(hipXSeries, durationSec) {
  const valid = hipXSeries.filter((x) => x != null);
  if (valid.length < 2 || durationSec <= 0) return null;
  const displacement = Math.abs(valid[valid.length - 1] - valid[0]);
  return displacement / durationSec;
}

function computeSymmetryIndex(events, fps) {
  if (events.length < 3) return null;
  const intervals = [];
  for (let i = 1; i < events.length; i++) {
    intervals.push((events[i] - events[i - 1]) / fps);
  }
  const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const variance = intervals.reduce((a, b) => a + (b - mean) ** 2, 0) / intervals.length;
  const cv = mean > 0 ? Math.sqrt(variance) / mean : 1;
  return Math.max(0, 1 - cv);
}

function averageTrunkLean(shoulderXSeries, hipXSeries) {
  const diffs = [];
  for (let i = 0; i < shoulderXSeries.length; i++) {
    if (shoulderXSeries[i] != null && hipXSeries[i] != null) {
      diffs.push(Math.abs(shoulderXSeries[i] - hipXSeries[i]));
    }
  }
  if (diffs.length === 0) return null;
  const avg = diffs.reduce((a, b) => a + b, 0) / diffs.length;
  return avg * 100;
}

function coarseKneeROM(landmarkSeries) {
  const angles = landmarkSeries
    .map((f) => estimateKneeAngle(f))
    .filter((a) => a != null);
  if (angles.length === 0) return null;
  return Math.max(...angles) - Math.min(...angles);
}

function estimateKneeAngle(frame) {
  const hip = frame[LM.LEFT_HIP];
  const knee = frame[LM.LEFT_KNEE];
  const ankle = frame[LM.LEFT_ANKLE];
  if (!hip || !knee || !ankle) return null;

  const v1 = { x: hip.x - knee.x, y: hip.y - knee.y };
  const v2 = { x: ankle.x - knee.x, y: ankle.y - knee.y };
  const dot = v1.x * v2.x + v1.y * v2.y;
  const mag1 = Math.hypot(v1.x, v1.y);
  const mag2 = Math.hypot(v2.x, v2.y);
  if (mag1 === 0 || mag2 === 0) return null;

  const cosAngle = Math.min(1, Math.max(-1, dot / (mag1 * mag2)));
  return (Math.acos(cosAngle) * 180) / Math.PI;
}