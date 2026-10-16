-- Forward migration: preserve the original applied migration and every marker row.
BEGIN;
ALTER TABLE "SetupCheck" RENAME TO vora_platform_setup_check;
ALTER TABLE vora_platform_setup_check RENAME COLUMN "createdAt" TO created_at;
ALTER TABLE vora_platform_setup_check
  RENAME CONSTRAINT "SetupCheck_pkey" TO vora_platform_setup_check_pkey;
COMMIT;
