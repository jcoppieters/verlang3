-- Add an HTTPS scheme to item URLs that do not already have one.
UPDATE items
SET url = CASE
  WHEN LEFT(TRIM(url), 2) = '//' THEN CONCAT('https:', TRIM(url))
  ELSE CONCAT('https://', TRIM(url))
END
WHERE TRIM(url) <> ''
  AND (
    LOWER(TRIM(url)) NOT REGEXP '^[a-z][a-z0-9+.-]*:'
    OR LOWER(TRIM(url)) REGEXP '^([a-z0-9.-]+[.][a-z0-9.-]+|localhost):[0-9]+([/?#]|$)'
  );