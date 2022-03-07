/*
SELECT
  "tmp"."userId", "User"."username", "tmp"."chatId"
FROM(
  SELECT
    "userId", "chatId"
  FROM "Chat"
  INNER JOIN "UserChat" ON "Chat"."id"="UserChat"."chatId"
) AS tmp
LEFT JOIN "User" ON "User"."id"="tmp"."userId"
WHERE "tmp"."userId" != 7 AND "tmp"."chatId" = 1;

SELECT
  "UserChat"."userId", "User"."username", "UserChat"."chatId"
FROM "Chat"
LEFT JOIN "UserChat" ON "Chat"."id"="UserChat"."chatId"
LEFT JOIN "User" ON "User"."id"="UserChat"."userId"
WHERE "UserChat"."userId" != 7 AND "UserChat"."chatId" = 2;

SELECT
  "UserChat"."userId", "User"."username", "UserChat"."chatId"
FROM "UserChat"
LEFT JOIN "User" ON "User"."id"="UserChat"."userId"
WHERE "UserChat"."userId" != 7 AND "UserChat"."chatId" = 2;


SELECT
  *
FROM "UserChat";

SELECT
  *
FROM "Chat"
INNER JOIN "UserChat" ON id=chatId;
*/

DELETE FROM "UserChat"
WHERE "UserChat"."chatId" = 4;

DELETE FROM "Message"
WHERE "Message"."chatId" = 4;

DELETE FROM "Chat"
WHERE id = 4;