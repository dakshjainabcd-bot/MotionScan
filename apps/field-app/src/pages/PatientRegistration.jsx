import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePatientSession } from '../context/PatientSessionContext';

export default function PatientRegistration() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setSession } = usePatientSession();

  const [form, setForm] = useState({
    patientLocalId: '',
    name: '',
    age: '',
    gender: '',
    village: '',
    district: '',
    occupation: '',
  });
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isValid =
    form.name.trim() !== '' &&
    form.age !== '' &&
    Number(form.age) > 0 &&
    form.gender !== '' &&
    form.district.trim() !== '';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) {
      setError('Please fill in name, age, gender, and district before continuing.');
      return;
    }
    setError('');

    setSession((prev) => ({
      ...prev,
      id: crypto.randomUUID(),
      patientLocalId: form.patientLocalId.trim() || null,
      name: form.name.trim(),
      age: Number(form.age),
      gender: form.gender,
      village: form.village.trim(),
      district: form.district.trim(),
      occupation: form.occupation.trim(),
    }));

    navigate('/safety-screen');
  };

  return (
    <div className="p-4 max-w-lg mx-auto text-left">
      <h1 className="text-xl font-semibold mb-4">{t('patientReg.title')}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">{t('patientReg.name')}</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">{t('patientReg.age')}</label>
          <input
            type="number"
            min="1"
            max="120"
            value={form.age}
            onChange={(e) => handleChange('age', e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">{t('patientReg.gender')}</label>
          <div className="flex gap-3">
            {['female', 'male', 'other'].map((g) => (
              <button
                type="button"
                key={g}
                onClick={() => handleChange('gender', g)}
                className={`px-4 py-2 rounded border ${
                  form.gender === g ? 'bg-blue-600 text-white' : 'bg-gray-100'
                }`}
              >
                {t(`patientReg.genderOptions.${g}`)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">{t('patientReg.village')}</label>
          <input
            type="text"
            value={form.village}
            onChange={(e) => handleChange('village', e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">{t('patientReg.district')}</label>
          <input
            type="text"
            value={form.district}
            onChange={(e) => handleChange('district', e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">{t('patientReg.occupation')}</label>
          <input
            type="text"
            value={form.occupation}
            onChange={(e) => handleChange('occupation', e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">{t('patientReg.patientLocalId')}</label>
          <input
            type="text"
            value={form.patientLocalId}
            onChange={(e) => handleChange('patientLocalId', e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button type="submit" className="w-full py-3 rounded bg-blue-600 text-white">
          {t('patientReg.continue')}
        </button>
      </form>
    </div>
  );
}