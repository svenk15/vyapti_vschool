-- Preserve historical migration checksums and every existing marker row.
BEGIN;
ALTER TABLE vora_platform_setup_check RENAME TO vs_platform_setup_check;
ALTER TABLE vs_platform_setup_check
  RENAME CONSTRAINT vora_platform_setup_check_pkey TO vs_platform_setup_check_pkey;
COMMIT;
