CREATE TABLE "vs_academics_day_pattern" (
 "id" uuid NOT NULL,"organization_id" uuid NOT NULL,"school_id" uuid NOT NULL,"academic_year_id" uuid NOT NULL,
 "name" varchar(80) NOT NULL,"teaching_days" smallint[] NOT NULL,"state" varchar(16) NOT NULL,"version" integer NOT NULL,
 "created_at" timestamptz(3) NOT NULL,"created_by_account_id" uuid NOT NULL,"updated_at" timestamptz(3) NOT NULL,
 CONSTRAINT "vs_academics_day_pattern_pkey" PRIMARY KEY ("id"),
 CONSTRAINT "vs_academics_day_pattern_name_check" CHECK (char_length(btrim("name")) BETWEEN 1 AND 80),
 CONSTRAINT "vs_academics_day_pattern_days_check" CHECK (cardinality("teaching_days") BETWEEN 1 AND 7 AND "teaching_days" <@ ARRAY[1,2,3,4,5,6,7]::smallint[]),
 CONSTRAINT "vs_academics_day_pattern_state_check" CHECK ("state" IN ('DRAFT','PUBLISHED')),
 CONSTRAINT "vs_academics_day_pattern_version_check" CHECK ("version">0),
 CONSTRAINT "vs_academics_day_pattern_org_fkey" FOREIGN KEY ("organization_id") REFERENCES "vs_access_organization"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT "vs_academics_day_pattern_school_fkey" FOREIGN KEY ("organization_id","school_id") REFERENCES "vs_access_school"("organization_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT "vs_academics_day_pattern_year_fkey" FOREIGN KEY ("organization_id","school_id","academic_year_id") REFERENCES "vs_academics_academic_year"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT "vs_academics_day_pattern_creator_fkey" FOREIGN KEY ("created_by_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT "vs_academics_day_pattern_scope_id_key" UNIQUE ("organization_id","school_id","id")
);
CREATE UNIQUE INDEX "vs_academics_day_pattern_one_draft_key" ON "vs_academics_day_pattern"("organization_id","school_id","academic_year_id") WHERE "state"='DRAFT';
CREATE INDEX "vs_academics_day_pattern_context_idx" ON "vs_academics_day_pattern"("organization_id","school_id","academic_year_id","state","updated_at" DESC);

CREATE TABLE "vs_academics_day_period" (
 "id" uuid NOT NULL,"organization_id" uuid NOT NULL,"school_id" uuid NOT NULL,"day_pattern_id" uuid NOT NULL,"period_key" uuid NOT NULL,
 "label" varchar(60) NOT NULL,"kind" varchar(12) NOT NULL,"start_local" time(0) NOT NULL,"end_local" time(0) NOT NULL,"position" smallint NOT NULL,
 CONSTRAINT "vs_academics_day_period_pkey" PRIMARY KEY ("id"),
 CONSTRAINT "vs_academics_day_period_label_check" CHECK (char_length(btrim("label")) BETWEEN 1 AND 60),
 CONSTRAINT "vs_academics_day_period_kind_check" CHECK ("kind" IN ('LESSON','BREAK')),
 CONSTRAINT "vs_academics_day_period_time_check" CHECK ("start_local"<"end_local"),
 CONSTRAINT "vs_academics_day_period_position_check" CHECK ("position">0),
 CONSTRAINT "vs_academics_day_period_pattern_fkey" FOREIGN KEY ("organization_id","school_id","day_pattern_id") REFERENCES "vs_academics_day_pattern"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT "vs_academics_day_period_key_key" UNIQUE ("organization_id","school_id","day_pattern_id","period_key"),
 CONSTRAINT "vs_academics_day_period_position_key" UNIQUE ("organization_id","school_id","day_pattern_id","position")
);
CREATE INDEX "vs_academics_day_period_pattern_idx" ON "vs_academics_day_period"("organization_id","school_id","day_pattern_id","position");
COMMENT ON TABLE "vs_academics_day_pattern" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=academics; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_academics_day_period" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=academics; scope=organization_id,school_id; closureGate=TEN-03';
