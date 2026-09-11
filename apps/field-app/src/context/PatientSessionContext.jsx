import { createContext, useContext, useState } from 'react';

const PatientSessionContext = createContext(null);

export function PatientSessionProvider({ children }) {
  const [session, setSession] = useState({
    id: null,               // client-generated UUID, set at registration
    patientLocalId: null,   // optional non-identifying reference (maps to backend's patient_local_id)
    name: null,
    age: null,
    gender: null,
    village: null,
    district: null,
    occupation: null,
    redFlagTriggered: null,
    redFlagReason: null,
  });

  return (
    <PatientSessionContext.Provider value={{ session, setSession }}>
      {children}
    </PatientSessionContext.Provider>
  );
}

export function usePatientSession() {
  const ctx = useContext(PatientSessionContext);
  if (!ctx) throw new Error('usePatientSession must be used inside PatientSessionProvider');
  return ctx;
}