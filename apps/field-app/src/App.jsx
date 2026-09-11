import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PatientSessionProvider } from './context/PatientSessionContext';
import LanguageSwitcher from './components/LanguageSwitcher';
import PatientRegistration from './pages/PatientRegistration';
import SafetyScreen from './pages/SafetyScreen';
import GuidedSetup from './pages/GuidedSetup';
import ReferralOnly from './pages/ReferralOnly';

export default function App() {
  return (
    <PatientSessionProvider>
      <BrowserRouter>
        <LanguageSwitcher />
        <Routes>
          <Route path="/" element={<PatientRegistration />} />
          <Route path="/safety-screen" element={<SafetyScreen />} />
          <Route path="/guided-setup" element={<GuidedSetup />} />
          <Route path="/referral-only" element={<ReferralOnly />} />
          {/* /walk-test, /womac, /result are added in later phases */}
        </Routes>
      </BrowserRouter>
    </PatientSessionProvider>
  );
}