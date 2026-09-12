import { useState } from 'react';
import { PatientSessionContext } from './sessionContext';

export function PatientSessionProvider({ children }) {
  const [session, setSession] = useState({
    id: null,
    patientLocalId: null,
    name: null,
    age: null,
    gender: null,
    village: null,
    district: null,
    occupation: null,
    redFlagTriggered: null,
    redFlagReason: null,
    guidedSetupComplete: false,
    gaitFeatures: null,
  });

  return (
    <PatientSessionContext.Provider value={{ session, setSession }}>
      {children}
    </PatientSessionContext.Provider>
  );
}