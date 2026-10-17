ALTER TABLE "vs_finance_capability_grant"
  DROP CONSTRAINT "vs_finance_capability_grant_limit_check",
  ADD CONSTRAINT "vs_finance_capability_grant_limit_check" CHECK (
    ("capability"='EXCEPTION_REVIEW' AND "currency" IS NOT NULL AND "approval_limit_minor" IS NOT NULL AND "approval_limit_minor">=0)
    OR
    ("capability"<>'EXCEPTION_REVIEW' AND "currency" IS NULL AND "approval_limit_minor" IS NULL)
  );

ALTER TABLE "vs_finance_exception"
  DROP CONSTRAINT "vs_finance_exception_state_check",
  ADD CONSTRAINT "vs_finance_exception_state_check" CHECK (
    ("state"='PENDING' AND "decided_at" IS NULL AND "decision_reason" IS NULL)
    OR
    ("state"='APPROVED' AND "decided_at" IS NOT NULL)
    OR
    ("state"='REJECTED' AND "decided_at" IS NOT NULL AND "decision_reason" IS NOT NULL)
  );
