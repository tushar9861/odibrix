-- Add phone column to agents table
ALTER TABLE agents ADD COLUMN phone text;

-- Add index for phone lookups
CREATE INDEX idx_agents_phone ON agents(phone);

-- Commit the transaction
COMMIT;
