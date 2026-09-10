const express = require('express');
const db = require('../db/init');
const { requireAuth, scopeToRole } = require('../middleware/auth');

const router = express.Router();

// Field App -> Backend sync. No auth on this route by design: ASHA workers
// don't have Dashboard logins; a device-level auth scheme is a future TODO.
router.post('/', (req, res) => {
  const s = req.body;
  if (!s.id || !s.district || !s.recorded_at_device) {
    return res.status(400).json({ error: 'id, district, recorded_at_device are required' });
  }

  const stmt = db.prepare(`
    INSERT INTO screenings (
      id, patient_local_id, age, gender, village, district, occupation,
      red_flag_triggered, red_flag_reason,
      camera_quality_good, senseband_quality_good, trials_consistent,
      screening_probability, screening_category, shap_top_factors, model_version,
      esanjeevani_handoff_initiated, esanjeevani_handoff_completed,
      asha_worker_id, recorded_at_device
    ) VALUES (
      @id, @patient_local_id, @age, @gender, @village, @district, @occupation,
      @red_flag_triggered, @red_flag_reason,
      @camera_quality_good, @senseband_quality_good, @trials_consistent,
      @screening_probability, @screening_category, @shap_top_factors, @model_version,
      @esanjeevani_handoff_initiated, @esanjeevani_handoff_completed,
      @asha_worker_id, @recorded_at_device
    )
    ON CONFLICT(id) DO NOTHING
  `);

  stmt.run({
    patient_local_id: null, age: null, gender: null, village: null, occupation: null,
    red_flag_triggered: 0, red_flag_reason: null,
    camera_quality_good: null, senseband_quality_good: null, trials_consistent: null,
    screening_probability: null, screening_category: null, shap_top_factors: null, model_version: null,
    esanjeevani_handoff_initiated: 0, esanjeevani_handoff_completed: 0, asha_worker_id: null,
    ...s,
  });

  res.status(201).json({ synced: true, id: s.id });
});

// Dashboard read, role-scoped + aggregated-by-default.
router.get('/', requireAuth, scopeToRole, (req, res) => {
  const { viewLevel, district } = req.dataScope;
  const { view = 'aggregate' } = req.query;

  if (view === 'individual') {
    if (viewLevel !== 'state') {
      const rows = db.prepare('SELECT * FROM screenings WHERE district = ?').all(district);
      return res.json(rows);
    }
    return res.status(403).json({
      error: 'State-level role must use aggregate view; individual records require district-supervisor scope',
    });
  }

  const rows = db.prepare(`
    SELECT district, screening_category, COUNT(*) as count
    FROM screenings
    GROUP BY district, screening_category
  `).all();
  res.json(rows);
});

module.exports = router;