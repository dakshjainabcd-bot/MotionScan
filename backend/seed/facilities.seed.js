const db = require('../db/init');

// ⚠️ PLACEHOLDER — NOT VERIFIED real hospital data. Replace before any real deployment.
const placeholderFacilities = [
  { name: 'Civil Hospital (PLACEHOLDER)', district: 'Placeholder District 1', has_orthopaedic: 1, latitude: 26.1445, longitude: 91.7362, phone: '', verified: 0 },
  { name: 'District Hospital (PLACEHOLDER)', district: 'Placeholder District 2', has_orthopaedic: 0, latitude: 25.5788, longitude: 91.8933, phone: '', verified: 0 },
  { name: 'CHC (PLACEHOLDER)', district: 'Placeholder District 3', has_orthopaedic: 0, latitude: 24.8170, longitude: 93.9368, phone: '', verified: 0 },
];

const insert = db.prepare(`
  INSERT INTO facilities (name, district, has_orthopaedic, latitude, longitude, phone, verified)
  VALUES (@name, @district, @has_orthopaedic, @latitude, @longitude, @phone, @verified)
`);

const insertMany = db.transaction((rows) => {
  for (const row of rows) insert.run(row);
});

insertMany(placeholderFacilities);
console.log(`Seeded ${placeholderFacilities.length} placeholder facilities. REPLACE BEFORE REAL USE.`);