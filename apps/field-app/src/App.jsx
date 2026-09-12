import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PatientSessionProvider } from './context/PatientSessionContext';
import LanguageSwitcher from './components/LanguageSwitcher';
import PatientRegistration from './pages/PatientRegistration';
import SafetyScreen from './pages/SafetyScreen';
import GuidedSetup from './pages/GuidedSetup';
import WalkTest from './pages/WalkTest';
import WomacQuestionnaire from './pages/WomacQuestionnaire';
import RiskFactorForm from './pages/RiskFactorForm';
import SessionSummary from './pages/SessionSummary';
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
          <Route path="/womac" element={<WomacQuestionnaire />} />
          <Route path="/risk-factors" element={<RiskFactorForm />} />
          <Route path="/session-summary" element={<SessionSummary />} />
          <Route path="/referral-only" element={<ReferralOnly />} />
        </Routes>
      </BrowserRouter>
    </PatientSessionProvider>
  );
}