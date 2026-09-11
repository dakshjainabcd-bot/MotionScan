import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RED_FLAG_QUESTIONS } from '../data/redFlagQuestions';
import { usePatientSession } from '../context/PatientSessionContext';

export default function SafetyScreen() {
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();
  const { setSession } = usePatientSession();

  const handleAnswer = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const allAnswered = RED_FLAG_QUESTIONS.every((q) => answers[q.id] !== undefined);

  const handleContinue = () => {
    const triggeredQuestion = RED_FLAG_QUESTIONS.find((q) => answers[q.id] === true);
    if (triggeredQuestion) {
      setSession((prev) => ({
        ...prev,
        redFlagTriggered: true,
        redFlagReason: triggeredQuestion.text,
      }));
      navigate('/referral-only');
      return;
    }
    setSession((prev) => ({ ...prev, redFlagTriggered: false, redFlagReason: null }));
    navigate('/guided-setup');
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-semibold mb-4">Safety Screening</h1>
      {RED_FLAG_QUESTIONS.map((q) => (
        <div key={q.id} className="mb-4 border rounded p-3">
          <p className="mb-2">{q.text}</p>
          <div className="flex gap-3">
            <button
              type="button"
              className={`px-4 py-2 rounded ${answers[q.id] === true ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
              onClick={() => handleAnswer(q.id, true)}
            >
              Yes
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded ${answers[q.id] === false ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
              onClick={() => handleAnswer(q.id, false)}
            >
              No
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        disabled={!allAnswered}
        onClick={handleContinue}
        className="w-full py-3 rounded bg-blue-600 text-white disabled:bg-gray-300"
      >
        Continue
      </button>
    </div>
  );
}