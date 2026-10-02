ALTER TABLE resources ADD COLUMN tags_text TEXT NOT NULL DEFAULT '';
DROP TABLE resource_search;
CREATE VIRTUAL TABLE resource_search USING fts5(
  name, summary_es, summary_en, organization, tags_text,
  content='resources', content_rowid='rowid',
  tokenize='unicode61 remove_diacritics 2'
);
CREATE TRIGGER resources_ai AFTER INSERT ON resources BEGIN
  INSERT INTO resource_search(rowid,name,summary_es,summary_en,organization,tags_text)
  VALUES(new.rowid,new.name,new.summary_es,new.summary_en,new.organization,new.tags_text);
END;
CREATE TRIGGER resources_ad AFTER DELETE ON resources BEGIN
  INSERT INTO resource_search(resource_search,rowid,name,summary_es,summary_en,organization,tags_text)
  VALUES('delete',old.rowid,old.name,old.summary_es,old.summary_en,old.organization,old.tags_text);
END;
CREATE TRIGGER resources_au AFTER UPDATE ON resources BEGIN
  INSERT INTO resource_search(resource_search,rowid,name,summary_es,summary_en,organization,tags_text)
  VALUES('delete',old.rowid,old.name,old.summary_es,old.summary_en,old.organization,old.tags_text);
  INSERT INTO resource_search(rowid,name,summary_es,summary_en,organization,tags_text)
  VALUES(new.rowid,new.name,new.summary_es,new.summary_en,new.organization,new.tags_text);
END;
INSERT INTO resource_search(resource_search) VALUES('rebuild');
