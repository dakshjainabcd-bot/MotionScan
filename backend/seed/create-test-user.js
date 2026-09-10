const bcrypt = require('bcryptjs');
const db = require('../db/init');

const testUsers = [
  { name: 'Asha Supervisor Test', username: 'asha_test', password: 'Test@1234', role: 'asha_supervisor', district: 'Placeholder District 1' },
  { name: 'District Officer Test', username: 'district_test', password: 'Test@1234', role: 'district_officer', district: 'Placeholder District 1' },
  { name: 'State Officer Test', username: 'state_test', password: 'Test@1234', role: 'state', district: null },
];

const insert = db.prepare(`
  INSERT INTO users (name, username, password_hash, role, district)
  VALUES (@name, @username, @password_hash, @role, @district)
`);

for (const u of testUsers) {
  const password_hash = bcrypt.hashSync(u.password, 10);
  try {
    insert.run({ name: u.name, username: u.username, password_hash, role: u.role, district: u.district });
    console.log(`Created user: ${u.username} / ${u.password}  (role: ${u.role})`);
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      console.log(`User "${u.username}" already exists — skipped.`);
    } else {
      throw err;
    }
  }
}

console.log('Done seeding test users.');