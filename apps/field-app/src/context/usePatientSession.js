import { useContext } from 'react';
import { PatientSessionContext } from './sessionContext';

export function usePatientSession() {
  const ctx = useContext(PatientSessionContext);
  if (!ctx) throw new Error('usePatientSession must be used inside PatientSessionProvider');
  return ctx;
}