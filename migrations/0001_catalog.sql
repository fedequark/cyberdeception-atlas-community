PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS resources (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  kind TEXT NOT NULL CHECK(kind IN ('product','service','paper','software','case-study','dataset','framework','community')),
  name TEXT NOT NULL,
  summary_es TEXT NOT NULL,
  summary_en TEXT NOT NULL,
  organization TEXT NOT NULL DEFAULT '',
  year INTEGER,
  source_url TEXT NOT NULL,
  evidence TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'published' CHECK(status IN ('draft','review','published','archived')),
  reviewed_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  data TEXT NOT NULL CHECK(json_valid(data))
);
CREATE INDEX resources_status_kind ON resources(status, kind);
CREATE INDEX resources_year ON resources(year);

CREATE VIRTUAL TABLE resource_search USING fts5(name, summary_es, summary_en, organization, tags, content='', tokenize='unicode61 remove_diacritics 2');

CREATE TABLE sources (
  id TEXT PRIMARY KEY,
  resource_id TEXT NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  accessed_at TEXT NOT NULL,
  review_basis TEXT NOT NULL,
  note TEXT NOT NULL DEFAULT ''
);
CREATE INDEX sources_resource ON sources(resource_id);

CREATE TABLE relationships (
  from_id TEXT NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  to_id TEXT NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  relation TEXT NOT NULL,
  PRIMARY KEY(from_id, to_id, relation)
);

CREATE TABLE submissions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  kind TEXT NOT NULL,
  note TEXT NOT NULL,
  submitted_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','accepted','rejected'))
);

CREATE TABLE revisions (
  id TEXT PRIMARY KEY,
  resource_id TEXT NOT NULL,
  actor TEXT NOT NULL,
  created_at TEXT NOT NULL,
  before_data TEXT,
  after_data TEXT NOT NULL,
  action TEXT NOT NULL
);

CREATE TABLE usage_limits (
  bucket TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0,
  expires_at TEXT NOT NULL
);

CREATE TABLE monitored_sources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  checked_at TEXT,
  etag TEXT,
  modified TEXT,
  fingerprint TEXT,
  last_status INTEGER,
  enabled INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE monitoring_events (
  id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL REFERENCES monitored_sources(id),
  detected_at TEXT NOT NULL,
  kind TEXT NOT NULL,
  detail TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
);
