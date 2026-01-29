-- Compatible with older MySQL versions
ALTER TABLE users ADD provider VARCHAR(255);
ALTER TABLE users ADD provider_id VARCHAR(255);
