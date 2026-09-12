import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PatientSessionProvider } from './context/PatientSessionContext';
import LanguageSwitcher from './components/LanguageSwitcher';
import PatientRegistration from './pages/PatientRegistration';
import SafetyScreen from './pages/SafetyScreen';
import GuidedSetup from './pages/GuidedSetup';
import WalkTest from './pages/WalkTest';
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
          <Route path="/walk-test" element={<WalkTest />} />
          <Route path="/referral-only" element={<ReferralOnly />} />
        </Routes>
      </BrowserRouter>
    </PatientSessionProvider>
  );
}