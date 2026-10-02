CREATE TABLE IF NOT EXISTS release_state (
  singleton INTEGER PRIMARY KEY CHECK(singleton = 1),
  version TEXT NOT NULL,
  published_at TEXT NOT NULL,
  source_commit TEXT NOT NULL,
  catalog_sha256 TEXT NOT NULL
);
INSERT OR IGNORE INTO release_state(singleton,version,published_at,source_commit,catalog_sha256)
VALUES(1,'v2026.09.2','2026-09-26','','');
