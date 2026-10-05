# Rendered route coverage

Baseline captured 5 October 2026; follow-up review 6 October 2026. The route groups below cover every implemented page route in `app/`; API routes are excluded because they do not render a screen. “Rendered” means a representative route state was opened and inspected; it does not imply every form/error state or accessibility criterion has been reviewed.

| Route | User goal | Shared pattern | Issues found at baseline | Verification status |
|---|---|---|---|---|
| `/` | Understand VSchool and enter setup | SiteHeader, public hero, feature cards | Main headline wraps cleanly at 390px | Rendered desktop/mobile |
| `/sign-in`, `/sign-in/[school]` | Sign in to a school | AuthLayout, AccessLogin, published school palette | Consolidated split auth composition; generic intro is distinct from task-specific form heading | Rendered desktop/mobile |
| `/activate`, `/invite`, `/forgot-password`, `/reset-password` | Activate access or recover credentials | AuthLayout, focused form, status feedback | Shared layout; inspect individual validation and terminal feedback states during functional review | Rendered desktop/mobile |
| `/account`, `/institutions` | Choose current workspace or manage branches | PageHeader, context cards/forms | Long branch names now wrap in the shared context bar | Implemented routes covered by source inventory; fresh screenshot absent |
| `/admin`, `/admin/setup`, `/admin/school`, `/admin/modules`, `/admin/branding` | Review school and manage its configuration | AdminPortalFrame, PageHeader, sections/forms | Dashboard shows summaries/common tasks; branding form is intentionally information-dense | Rendered desktop/mobile |
| `/admin/users`, `/admin/teachers` | Manage staff access and profiles | AdminPortalFrame, forms/tables, status feedback | Focused form/table states; no horizontal page overflow | Rendered desktop/mobile |
| `/admin/students`, `/admin/students/[id]` | Find and maintain student records | AdminPortalFrame, filters, ServerTable, detail history | Contained table and detail history | Rendered desktop/mobile for list; detail rendered desktop |
| `/admin/imports` | Preview, validate and process a roster | AdminPortalFrame, FileUpload, step/status feedback, table | CSV contract remains 2 MiB; narrow controls stay within page | Rendered desktop/mobile |
| `/admin/academics`, `/admin/classes` | Configure school year and teaching assignments | AdminPortalFrame, forms and tables | Related fields and table placement reviewed at route level | Rendered desktop/mobile |
| `/admin/attendance/sessions`, `/admin/attendance/sessions/[id]` | Schedule, review or correct attendance | AdminPortalFrame, operational summary, tables and confirmation | Summary grid corrected to three desktop / two tablet / one mobile columns; detail route still needs a fresh screenshot | List rendered desktop/mobile; detail source route exists, no final screenshot |
| `/admin/reports/attendance` | Review and export attendance | AdminPortalFrame, date filters, summary cards, ServerTable | Filters/actions separated; summary cards use a responsive grid | Rendered desktop/mobile before final grid fix; focused desktop/mobile grid assertion passes after fix |
| `/teacher/today`, `/teacher/sessions/[id]` | Review teaching day and take attendance | TeacherPortalFrame, session cards, roll-call table | Teacher navigation stays teaching-focused; long context wraps; mobile class cards remain readable | Rendered desktop/mobile |
| `/configure` | Preview institution, module and palette choices | ConfigurationPreview, BrandSurface | Palette preview remains local and uses shared production samples | Rendered desktop/mobile |
| `/design-system` | Inspect approved production UI patterns | ComponentGallery and shared components | Theme switch and shared portal/auth compositions present | Rendered desktop/mobile; focused browser suite passes |

## Follow-up evidence — 6 October 2026

The earlier rendered route pass captured 49 states across 25 unique routes at 1440px desktop and 390px mobile: zero HTTP failures, page errors, or document-width overflow. Screenshots live in ignored `artifacts/portal-ux/` (`before-admin-*`, `admin-*`, `admin-report-*`, `teacher-*`, `generic-signin-*`, and route-family captures). Inspection found mobile sign-out wrapping, vertically stacked attendance summary cards, truncated long context names, and repeated generic auth copy. Shared CSS/AuthLayout fixes address those findings. The focused design-system and branding browser suite passed 10/10 desktop/mobile journeys. The full attendance desktop and mobile journeys then passed 1/1 each; the report grid's computed column count is asserted for both viewport sizes. Lint, typecheck, docs, boundaries, backend checks, and the production build passed. A fresh screenshot pass on that final source could not be completed because the session's Browser runtime failed to initialize (missing versioned `browser-service.mjs`). Therefore the saved after images predate those small corrections and must not be presented as pixel evidence for the final build.

The captured pass did not include `/account`, `/institutions`, or the admin attendance-session detail route. It used responsive viewport widths, not native 200% browser zoom. Keyboard behavior is covered only by the focused shared navigation/dialog journeys; native VoiceOver and NVDA are still untested. Do not claim complete visual acceptance or accessibility conformance until these gaps are reviewed.

## Review rule

Use 1440px desktop and 390px mobile captures for representative pages in every route group. Check 768px, 360px, and 200% browser zoom for shared layout patterns. Capture actual route renders with realistic synthetic data; record native VoiceOver/NVDA separately. A route-family check does not replace functional task verification or owner visual acceptance.
