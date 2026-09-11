import { usePatientSession } from '../context/PatientSessionContext';

export default function ReferralOnly() {
  const { session } = usePatientSession();
  return (
    <div className="p-6 max-w-lg mx-auto text-center">
      <h1 className="text-2xl font-bold text-red-700 mb-3">
        Direct Clinical Evaluation Recommended
      </h1>
      <p className="mb-4">
        Based on the safety screening, this patient should be evaluated directly by a
        healthcare professional. AI screening has not been performed.
      </p>
      <p className="text-sm text-gray-600">Reason flagged: {session.redFlagReason}</p>
      {/* Referral note / facility lookup wired in a later phase */}
    </div>
  );
}