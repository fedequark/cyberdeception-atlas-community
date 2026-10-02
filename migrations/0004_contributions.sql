ALTER TABLE submissions ADD COLUMN proposal_type TEXT NOT NULL DEFAULT 'new-record' CHECK(proposal_type IN ('correction','new-record','paper-review','software-update','translation','evaluation','reproduction'));
ALTER TABLE submissions ADD COLUMN source_locator TEXT NOT NULL DEFAULT '';
ALTER TABLE submissions ADD COLUMN interest TEXT NOT NULL DEFAULT '';
ALTER TABLE submissions ADD COLUMN credit_choice TEXT NOT NULL DEFAULT 'anonymous' CHECK(credit_choice IN ('anonymous','name','pseudonym'));
ALTER TABLE submissions ADD COLUMN credit_name TEXT NOT NULL DEFAULT '';
ALTER TABLE submissions ADD COLUMN ai_assisted INTEGER NOT NULL DEFAULT 0 CHECK(ai_assisted IN (0,1));
ALTER TABLE submissions ADD COLUMN decision_reason TEXT NOT NULL DEFAULT '';
ALTER TABLE submissions ADD COLUMN decided_by TEXT NOT NULL DEFAULT '';
ALTER TABLE submissions ADD COLUMN decided_at TEXT;
