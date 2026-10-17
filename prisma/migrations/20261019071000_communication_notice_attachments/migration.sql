ALTER TABLE "vs_documents_document_grant" ADD CONSTRAINT "vs_documents_grant_scope_version_id_key" UNIQUE ("organization_id","school_id","id","document_version_id");

CREATE TABLE "vs_communication_notice_proposal_attachment" (
  "id" uuid PRIMARY KEY,
  "organization_id" uuid NOT NULL,
  "school_id" uuid NOT NULL,
  "proposal_id" uuid NOT NULL,
  "revision_id" uuid NOT NULL,
  "position" integer NOT NULL,
  "document_version_id" uuid NOT NULL,
  "document_grant_id" uuid NOT NULL,
  "display_filename" varchar(180) NOT NULL,
  "created_at" timestamptz(3) NOT NULL,
  CONSTRAINT "vs_communication_proposal_attachment_revision_fkey" FOREIGN KEY ("organization_id","school_id","revision_id") REFERENCES "vs_communication_notice_proposal_revision"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_communication_proposal_attachment_proposal_fkey" FOREIGN KEY ("organization_id","school_id","proposal_id") REFERENCES "vs_communication_notice_proposal"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_communication_proposal_attachment_document_fkey" FOREIGN KEY ("organization_id","school_id","document_grant_id","document_version_id") REFERENCES "vs_documents_document_grant"("organization_id","school_id","id","document_version_id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_communication_proposal_attachment_position_check" CHECK ("position" BETWEEN 1 AND 5),
  CONSTRAINT "vs_communication_proposal_attachment_scope_id_key" UNIQUE ("organization_id","school_id","id"),
  CONSTRAINT "vs_communication_proposal_attachment_position_key" UNIQUE ("organization_id","school_id","revision_id","position"),
  CONSTRAINT "vs_communication_proposal_attachment_version_key" UNIQUE ("organization_id","school_id","revision_id","document_version_id")
);
CREATE INDEX "vs_communication_proposal_attachment_proposal_idx" ON "vs_communication_notice_proposal_attachment"("organization_id","school_id","proposal_id","revision_id","position");

CREATE TABLE "vs_communication_notice_attachment" (
  "id" uuid PRIMARY KEY,
  "organization_id" uuid NOT NULL,
  "school_id" uuid NOT NULL,
  "notice_version_id" uuid NOT NULL,
  "position" integer NOT NULL,
  "document_version_id" uuid NOT NULL,
  "document_grant_id" uuid NOT NULL,
  "display_filename" varchar(180) NOT NULL,
  "created_at" timestamptz(3) NOT NULL,
  CONSTRAINT "vs_communication_notice_attachment_version_fkey" FOREIGN KEY ("organization_id","school_id","notice_version_id") REFERENCES "vs_communication_notice_version"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_communication_notice_attachment_document_fkey" FOREIGN KEY ("organization_id","school_id","document_grant_id","document_version_id") REFERENCES "vs_documents_document_grant"("organization_id","school_id","id","document_version_id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_communication_notice_attachment_position_check" CHECK ("position" BETWEEN 1 AND 5),
  CONSTRAINT "vs_communication_notice_attachment_scope_id_key" UNIQUE ("organization_id","school_id","id"),
  CONSTRAINT "vs_communication_notice_attachment_position_key" UNIQUE ("organization_id","school_id","notice_version_id","position"),
  CONSTRAINT "vs_communication_notice_attachment_version_key" UNIQUE ("organization_id","school_id","notice_version_id","document_version_id")
);
CREATE INDEX "vs_communication_notice_attachment_version_idx" ON "vs_communication_notice_attachment"("organization_id","school_id","notice_version_id","position");

CREATE FUNCTION public.vs_communication_attachment_immutable() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'communication attachment row is immutable'; END $$;
CREATE TRIGGER vs_communication_proposal_attachment_immutable BEFORE UPDATE OR DELETE ON "vs_communication_notice_proposal_attachment" FOR EACH ROW EXECUTE FUNCTION public.vs_communication_attachment_immutable();
CREATE TRIGGER vs_communication_notice_attachment_immutable BEFORE UPDATE OR DELETE ON "vs_communication_notice_attachment" FOR EACH ROW EXECUTE FUNCTION public.vs_communication_attachment_immutable();

COMMENT ON TABLE "vs_communication_notice_proposal_attachment" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=communication; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_communication_notice_attachment" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=communication; scope=organization_id,school_id; closureGate=TEN-03';
