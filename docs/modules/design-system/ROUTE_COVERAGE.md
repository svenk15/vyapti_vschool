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

## Production-layout correction — 6 October 2026

The production routes now use the shared 248px grouped sidebar, outline navigation icons, compact context header, 28–30px page titles, 24px section rhythm, 720px settings forms and 1120px teacher workspace. School settings has a single page title, header Refresh action, separate General information and Campuses sections, and aligned form actions. Teacher Today has a 240px desktop date control, adjacent intrinsic-width Refresh action, timezone hint, compact session rows, state-specific actions and a calendar empty state with the selected date. The design-system workspace example now uses the same navigation, header, compact toolbar and calendar state composition.

| Classification | Implemented routes inspected |
|---|---|
| Overview | `/`, `/account`, `/admin`, `/admin/setup`, `/design-system` |
| Authentication | `/sign-in`, `/sign-in/[school]`, `/activate`, `/invite`, `/forgot-password`, `/reset-password` |
| Settings/form | `/configure`, `/admin/school`, `/admin/modules`, `/admin/branding`, `/admin/academics` |
| Directory/table | `/institutions`, `/admin/users`, `/admin/teachers`, `/admin/students`, `/admin/classes`, `/admin/attendance/sessions` |
| Detail | `/admin/students/[id]`, `/admin/attendance/sessions/[id]` |
| Import wizard | `/admin/imports` |
| Teacher task | `/teacher/today`, `/teacher/sessions/[id]` |
| Report | `/admin/reports/attendance` |

Final local Playwright audit opened every implemented route at 1440×1000 and 390×844, resolved real dynamic student/attendance links, and also checked four representative admin routes at a 720px layout equivalent to 200% scaling. All 60 renders returned without HTTP failure or page error and had zero document-width overflow. The audit found and then verified the correction of a five-pixel mobile Academic setup overflow caused by a default fieldset minimum width. Computed styles recorded 30px desktop/28px mobile portal titles, a 1120px teacher main width and three real assigned sessions on both desktop and mobile. Evidence is in ignored `artifacts/portal-ux-final/after/route-audit.json`; representative after screenshots are beside it. Before images for School settings and Teacher Today are in `artifacts/portal-ux-final/before/`.

Visual inspection covered School settings, Teacher Today, dashboard, student directory, import, report/permission state, Academic setup mobile, shared gallery and school-branded sign-in. The remaining visual limitations are deliberate horizontal scrolling for content-heavy tables on narrow screens and long single-page Academic setup content. The mobile shell keeps account controls in the top row and branch context below; keyboard open/first-link focus/Escape return remain covered by browser journeys. Native browser 200% zoom, VoiceOver, NVDA and owner visual acceptance remain outstanding, so this evidence does not establish accessibility conformance or human acceptance.

## Final-source FND-02 route capture — 6 October 2026

The isolated production build used by the full `pnpm test:e2e` run captured 28 implemented page routes at desktop and mobile sizes (56 renders). After the follow-up teacher-entry fix on source `dd6c863`, the updated account page was recaptured at desktop and mobile sizes and both linked to the assigned teaching day. All returned successfully: 0 failed HTTP responses, 0 page errors and 0 document-width overflow findings. The ignored screenshots are in `artifacts/fnd-02-demo/routes/`; `artifacts/fnd-02-demo/route-captures.json` contains route-level results. Spot inspection included the administrator dashboard, mobile grouped navigation, attendance report, student and import forms, teacher day, and published school-branded sign-in. This rendered evidence supplements earlier historical route passes above. Native browser zoom at 200%, VoiceOver, NVDA and owner visual acceptance remain outstanding; no accessibility conformance or human acceptance is claimed.
