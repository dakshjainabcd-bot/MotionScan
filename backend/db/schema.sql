-- Users table: ASHA supervisors / district officers / state staff who log into the Dashboard.
-- NOTE: ASHA field workers themselves do NOT get Dashboard logins — they live in the Field App.
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT NOT NULL,
  username      TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL CHECK(role IN ('asha_supervisor','district_officer','state')),
  district      TEXT,
  created_at    TEXT DEFAULT (datetime('now'))
);

-- Screenings table: one row per completed MotionScan screening session.
CREATE TABLE IF NOT EXISTS screenings (
  id                  TEXT PRIMARY KEY,
  patient_local_id    TEXT,
  age                 INTEGER,
  gender              TEXT,
  village             TEXT,
  district            TEXT NOT NULL,
  occupation          TEXT,
  red_flag_triggered  INTEGER DEFAULT 0,
  red_flag_reason     TEXT,
  camera_quality_good     INTEGER,
  senseband_quality_good  INTEGER,
  trials_consistent       INTEGER,
  screening_probability   REAL,
  screening_category      TEXT CHECK(screening_category IN ('LOW','REVIEW','HIGH') OR screening_category IS NULL),
  shap_top_factors    TEXT,
  model_version        TEXT,
  esanjeevani_handoff_initiated  INTEGER DEFAULT 0,
  esanjeevani_handoff_completed  INTEGER DEFAULT 0,
  asha_worker_id       TEXT,
  recorded_at_device    TEXT NOT NULL,
  synced_at             TEXT DEFAULT (datetime('now'))
);

-- Facilities table: referral targets for HIGH-risk cases.
CREATE TABLE IF NOT EXISTS facilities (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  name            TEXT NOT NULL,
  district        TEXT NOT NULL,
  has_orthopaedic INTEGER DEFAULT 0,
  latitude        REAL,
  longitude       REAL,
  phone           TEXT,
  verified        INTEGER DEFAULT 0
);

-- Config table: key-value store the backend pushes DOWN to the Field App on sync.
CREATE TABLE IF NOT EXISTS config (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL,
  updated_at  TEXT DEFAULT (datetime('now'))
);