# Actual API wiring

Extracted from route.ts exports/imports. [] denotes a dynamic segment. Empty method list means a re-export pattern; inspect its exact route source, do not infer an absent endpoint. Exact host code is under source-reference/. Request examples and limits for critical commands are in CRITICAL_WORKFLOWS.md.

| Route | Methods detected | Imported hosting adapter |
|---|---|---|
| `/api/auth/[...nextauth]` | GET, POST | `next-auth`, `next/server`, `@/lib/server/auth` |
| `/api/health/live` | GET |  |
| `/api/health` | GET | `@/lib/server/platform` |
| `/api/v1/academics/calendars/[id]/evaluate` | GET | `@/lib/server/academic-http` |
| `/api/v1/academics/calendars/[id]/publish` | POST | `@/lib/server/academic-http` |
| `/api/v1/academics/grades` | POST | `@/lib/server/academic-http` |
| `/api/v1/academics` | GET | `@/lib/server/academic-http` |
| `/api/v1/academics/sections` | POST | `@/lib/server/academic-http` |
| `/api/v1/academics/subjects` | POST | `@/lib/server/academic-http` |
| `/api/v1/academics/years/[id]/close` | POST | `@/lib/server/academic-http` |
| `/api/v1/academics/years/[id]/open` | POST | `@/lib/server/academic-http` |
| `/api/v1/academics/years/[id]/terms` | PUT | `@/lib/server/academic-http` |
| `/api/v1/academics/years` | POST | `@/lib/server/academic-http` |
| `/api/v1/activate` | POST | `@/lib/server/activation-http` |
| `/api/v1/audit` | GET | `@/lib/server/reporting-http` |
| `/api/v1/branding/assets` | POST | `@/lib/server/branding-http` |
| `/api/v1/branding/draft` | PUT | `@/lib/server/branding-http` |
| `/api/v1/branding/hosts/start` | POST | `@/lib/server/branding-http` |
| `/api/v1/branding/hosts/verify` | POST | `@/lib/server/branding-http` |
| `/api/v1/branding/preview` | POST | `@/lib/server/branding-http` |
| `/api/v1/branding/profile` | POST | `@/lib/server/branding-http` |
| `/api/v1/branding/publish` | POST | `@/lib/server/branding-http` |
| `/api/v1/branding/rollback` | POST | `@/lib/server/branding-http` |
| `/api/v1/branding` | GET | `@/lib/server/branding-http` |
| `/api/v1/campuses` | POST | `@/lib/server/management-http` |
| `/api/v1/commands/[command]/key/[key]` | GET | `@/lib/server/attendance-http` |
| `/api/v1/context` | GET | `@/lib/server/context-http` |
| `/api/v1/context/switch` | POST | `@/lib/server/context-http` |
| `/api/v1/employees/[id]/account-binding` | POST | `@/lib/server/people-http` |
| `/api/v1/employees/[id]/end` | PATCH | `@/lib/server/people-http` |
| `/api/v1/employees/[id]/teacher-profile` | POST | `@/lib/server/people-http` |
| `/api/v1/employees` | GET, POST | `@/lib/server/people-http` |
| `/api/v1/enrollments/[id]/transfer` | POST | `@/lib/server/student-http` |
| `/api/v1/enrollments/options` | GET | `@/lib/server/student-http` |
| `/api/v1/enrollments` | POST | `@/lib/server/student-http` |
| `/api/v1/imports/[id]/cancel` | POST | `@/lib/server/import-http` |
| `/api/v1/imports/[id]/confirm` | POST | `@/lib/server/import-http` |
| `/api/v1/imports/[id]/errors.csv` | GET | `@/lib/server/import-http` |
| `/api/v1/imports/[id]/process` | POST | `@/lib/server/import-http` |
| `/api/v1/imports/[id]` | GET | `@/lib/server/import-http` |
| `/api/v1/imports/[id]/rows` | GET | `@/lib/server/import-http` |
| `/api/v1/imports/options` | GET | `@/lib/server/import-http` |
| `/api/v1/imports/preview` | POST | `@/lib/server/import-http` |
| `/api/v1/institutions/[id]/branches` | POST | `@/lib/server/context-http` |
| `/api/v1/invitations/accept` | POST | `@/lib/server/staff-invite-acceptance-http` |
| `/api/v1/invitations` | POST | `@/lib/server/staff-invite-http` |
| `/api/v1/me` | GET | `@/lib/server/management-http` |
| `/api/v1/memberships/[id]` | PATCH | `@/lib/server/management-http` |
| `/api/v1/memberships` | GET, POST | `@/lib/server/management-http` |
| `/api/v1/modules/confirm` | POST | `@/lib/server/tenancy-module-http` |
| `/api/v1/modules` | GET, POST | `@/lib/server/tenancy-module-http` |
| `/api/v1/offerings` | GET, POST | `@/lib/server/academic-http` |
| `/api/v1/password-reset/accept` | POST | `@/lib/server/password-reset-http` |
| `/api/v1/password-reset` | POST | `@/lib/server/password-reset-http` |
| `/api/v1/people/selection` | GET | `@/lib/server/student-http` |
| `/api/v1/public/branding/[slug]` | GET | `@/lib/server/branding-http` |
| `/api/v1/public/branding/assets/[asset]/[file]` | GET | `@/lib/server/branding-http` |
| `/api/v1/reports/attendance` | GET | `@/lib/server/reporting-http` |
| `/api/v1/reports/attendance/sessions` | GET | `@/lib/server/reporting-http` |
| `/api/v1/reports/attendance.csv` | GET | `@/lib/server/reporting-http` |
| `/api/v1/school` | GET, PATCH | `@/lib/server/auth`, `@/lib/server/access`, `@/backend/modules/access/contracts`, `@/lib/server/management-http` |
| `/api/v1/sessions/[id]/cancel` | POST | `@/lib/server/attendance-http` |
| `/api/v1/sessions/[id]/corrections` | POST | `@/lib/server/attendance-http` |
| `/api/v1/sessions/[id]/history` | GET | `@/lib/server/attendance-http` |
| `/api/v1/sessions/[id]/open` | POST | `@/lib/server/attendance-http` |
| `/api/v1/sessions/[id]` | GET | `@/lib/server/attendance-http` |
| `/api/v1/sessions/[id]/submit` | POST | `@/lib/server/attendance-http` |
| `/api/v1/sessions` | POST | `@/lib/server/attendance-http` |
| `/api/v1/students/[id]/archive` | POST | `@/lib/server/student-http` |
| `/api/v1/students/[id]` | GET | `@/lib/server/student-http` |
| `/api/v1/students` | GET, POST | `@/lib/server/student-http` |
| `/api/v1/teacher/sessions` | GET | `@/lib/server/attendance-http` |
| `/api/v1/teacher-assignments/[id]/end` | PATCH | `@/lib/server/academic-http` |
| `/api/v1/teacher-assignments` | POST | `@/lib/server/academic-http` |
