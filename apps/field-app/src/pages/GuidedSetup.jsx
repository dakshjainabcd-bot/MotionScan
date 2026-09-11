import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CameraPreview from '../components/CameraPreview';
import ChecklistItem from '../components/ChecklistItem';
import { usePatientSession } from '../context/PatientSessionContext';

// Real automated pass/fail checks (full body visible, side-view orientation,
// distance, lighting) are wired in Phase 4 using MediaPipe. This phase builds
// the UI shell + live camera preview + a static checklist only, per the plan.
const CHECKLIST_ITEMS = [
  { id: 'fullBody', label: 'Full body visible in frame' },
  { id: 'sideView', label: 'Camera positioned for a side view' },
  { id: 'distance', label: 'Correct distance from camera' },
  { id: 'lighting', label: 'Adequate lighting' },
  { id: 'stationary', label: 'Camera is stationary' },
];

export default function GuidedSetup() {
  const [cameraError, setCameraError] = useState(null);
  const navigate = useNavigate();
  const { session } = usePatientSession();

  return (
    <div className="p-4 max-w-lg mx-auto text-left">
      <h1 className="text-xl font-semibold mb-2">Guided Camera Setup</h1>
      <p className="text-sm text-gray-600 mb-4">
        Position the phone so the patient's full body is visible from the side.
      </p>

      <CameraPreview onError={setCameraError} />

      {cameraError && (
        <p className="text-red-600 text-sm mt-2">
          Camera access failed: {cameraError}. Check browser permissions and try again.
        </p>
      )}

      <div className="mt-4 space-y-2">
        {CHECKLIST_ITEMS.map((item) => (
          <ChecklistItem key={item.id} label={item.label} status="pending" />
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-4">
        Automated pass/fail checks for each item above are wired in Module 1A
        (next phase). For now this screen confirms the live camera preview works.
      </p>

      <div className="mt-6 border-t pt-4 text-sm text-gray-600">
        <p>
          Patient: <strong>{session.name || '—'}</strong> · District:{' '}
          <strong>{session.district || '—'}</strong>
        </p>
      </div>

      <button
        type="button"
        onClick={() => navigate('/')}
        className="w-full mt-4 py-3 rounded bg-gray-200 text-gray-800"
      >
        Back to Patient Registration
      </button>
    </div>
  );
}