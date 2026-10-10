ALTER TABLE "vs_people_employee"
  ADD COLUMN "category" varchar(20) NOT NULL DEFAULT 'UNCLASSIFIED';

ALTER TABLE "vs_people_employee"
  ADD CONSTRAINT "vs_people_employee_category_check"
  CHECK ("category" IN ('TEACHING', 'ADMINISTRATION', 'SUPPORT', 'UNCLASSIFIED'));
