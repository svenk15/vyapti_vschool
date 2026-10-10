ALTER TABLE "vs_access_school"
  ADD COLUMN "office_email" VARCHAR(254),
  ADD COLUMN "office_phone" VARCHAR(40),
  ADD COLUMN "office_address" VARCHAR(500);

ALTER TABLE "vs_access_school"
  ADD CONSTRAINT "vs_access_school_office_email_check"
    CHECK ("office_email" IS NULL OR (length(btrim("office_email")) BETWEEN 3 AND 254 AND "office_email" = lower(btrim("office_email")))),
  ADD CONSTRAINT "vs_access_school_office_phone_check"
    CHECK ("office_phone" IS NULL OR length(btrim("office_phone")) BETWEEN 5 AND 40),
  ADD CONSTRAINT "vs_access_school_office_address_check"
    CHECK ("office_address" IS NULL OR length(btrim("office_address")) BETWEEN 1 AND 500);
