import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';

let landmarkerInstance = null;
let loadingPromise = null;

export function getPoseLandmarker() {
  if (landmarkerInstance) return Promise.resolve(landmarkerInstance);
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    const vision = await FilesetResolver.forVisionTasks('/models/wasm');

    landmarkerInstance = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: '/models/pose_landmarker_lite.task',
        delegate: 'GPU',
      },
      runningMode: 'VIDEO',
      numPoses: 1,
    });

    return landmarkerInstance;
  })();

  return loadingPromise;
}

export function detectFrame(landmarker, videoElement, timestampMs) {
  return landmarker.detectForVideo(videoElement, timestampMs);
}

export function disposeLandmarker() {
  if (landmarkerInstance) {
    landmarkerInstance.close();
    landmarkerInstance = null;
    loadingPromise = null;
  }
}