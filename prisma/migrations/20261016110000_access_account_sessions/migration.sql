CREATE TABLE "vs_access_account_session" (
  "id" UUID NOT NULL,
  "account_id" UUID NOT NULL,
  "token_version" INTEGER NOT NULL,
  "safe_label" VARCHAR(24) NOT NULL,
  "started_at" TIMESTAMPTZ(3) NOT NULL,
  "expires_at" TIMESTAMPTZ(3) NOT NULL,
  "revoked_at" TIMESTAMPTZ(3),
  "version" INTEGER NOT NULL,
  CONSTRAINT "vs_access_account_session_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_access_account_session_account_id_key" UNIQUE ("account_id", "id"),
  CONSTRAINT "vs_access_account_session_account_fkey" FOREIGN KEY ("account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_access_account_session_token_version_check" CHECK ("token_version" > 0),
  CONSTRAINT "vs_access_account_session_safe_label_check" CHECK ("safe_label" IN ('DESKTOP_WEB', 'MOBILE_WEB')),
  CONSTRAINT "vs_access_account_session_time_check" CHECK ("expires_at" > "started_at"),
  CONSTRAINT "vs_access_account_session_version_check" CHECK ("version" > 0)
);

CREATE INDEX "vs_access_account_session_account_active_idx"
  ON "vs_access_account_session" ("account_id", "revoked_at", "expires_at", "id");

COMMENT ON TABLE "vs_access_account_session" IS 'TEN-ADR-006 Path A; classification=GLOBAL_IDENTITY; owner=access; self-scoped by account_id; closureGate=TEN-03';
