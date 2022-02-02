/*
ALTER TABLE "user" 
  ALTER COLUMN is_verified SET DEFAULT false,
  ALTER COLUMN verified_at TYPE TIMESTAMP;
*/

ALTER TABLE "user" 
  RENAME COLUMN birth TO birthday;
