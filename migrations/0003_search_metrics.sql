-- Daily aggregate only. Search text and visitor identifiers are never stored.
CREATE TABLE IF NOT EXISTS search_metrics (
  day TEXT NOT NULL,
  locale TEXT NOT NULL CHECK (locale IN ('es','en')),
  zero_result_count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day,locale)
);
