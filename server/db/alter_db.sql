/*
ALTER TABLE "user" 
  ALTER COLUMN is_verified SET DEFAULT false,
  ALTER COLUMN verified_at TYPE TIMESTAMP;


ALTER TABLE "user" 
  RENAME COLUMN birth TO birthday;


DROP TABLE "UserVerification";
ALTER TABLE "userVerification"
  RENAME TO "UserVerification";
*/

DROP TABLE "UserChat";
DROP TABLE "Chat";
DROP TABLE "User";

ALTER TABLE "user"
  RENAME TO "User";
