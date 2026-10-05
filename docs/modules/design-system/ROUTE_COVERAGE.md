# Rendered route coverage

Baseline for the portal UX checkpoint, 5 October 2026. The route groups below cover every implemented page route in `app/`; API routes are excluded because they do not render a screen. “Shell pass” means the shared layout was checked in the rendered browser; it does not imply every route state or accessibility criterion has been reviewed.

| Route | User goal | Shared pattern | Issues found at baseline | Verification status |
|---|---|---|---|---|
| `/` | Understand VSchool and enter setup | SiteHeader, public hero, feature cards | Landing uses display typography and fixed-density feature cards; check mobile wrapping | Not yet audited |
| `/sign-in`, `/sign-in/[school]` | Sign in to a school | AuthLayout, AccessLogin, published school palette | Generic sign-in is vertically disconnected; branded sign-in already has a split identity/form composition | Branded sign-in rendered; generic pending |
| `/activate`, `/invite`, `/forgot-password`, `/reset-password` | Activate access or recover credentials | AuthLayout, focused form, status feedback | Separate page headings and cards do not align as one authentication experience | Pending |
| `/account`, `/institutions` | Choose current workspace or manage branches | PageHeader, context cards/forms | Review long institution names, branch forms, and list density | Pending |
| `/admin`, `/admin/setup`, `/admin/school`, `/admin/modules`, `/admin/branding` | Review school and manage its configuration | AdminPortalFrame, PageHeader, sections/forms | Shared navigation is implemented; dashboard still exposed branch creation inline at baseline; workspace theme did not follow publication | Shell implemented; content review pending |
| `/admin/users`, `/admin/teachers` | Manage staff access and profiles | AdminPortalFrame, forms/tables, status feedback | Check table proportions, dense action groups, and empty/error states | Shell implemented; content review pending |
| `/admin/students`, `/admin/students/[id]` | Find and maintain student records | AdminPortalFrame, filters, ServerTable, detail history | Check long names and contained table overflow | Shell implemented; content review pending |
| `/admin/imports` | Preview, validate and process a roster | AdminPortalFrame, FileUpload, step/status feedback, table | Preserve 2 MiB CSV contract; verify full-width controls and error density | Shell implemented; content review pending |
| `/admin/academics`, `/admin/classes` | Configure school year and teaching assignments | AdminPortalFrame, forms and tables | Check related field alignment and table widths | Shell implemented; content review pending |
| `/admin/attendance/sessions`, `/admin/attendance/sessions/[id]` | Schedule, review or correct attendance | AdminPortalFrame, operational summary, tables and confirmation | Check correction controls, changed-row feedback, and mobile table behavior | Shell implemented; full journey currently has unrelated timing/navigation E2E failure |
| `/admin/reports/attendance` | Review and export attendance | AdminPortalFrame, date filters, summary cards, ServerTable | Check filters/actions separation and narrow viewport | Shell implemented; content review pending |
| `/teacher/today`, `/teacher/sessions/[id]` | Review teaching day and take attendance | TeacherPortalFrame, session cards, roll-call table | Keep navigation teaching-focused; check roster at mobile widths | Shell implemented; full journey currently has unrelated timing/navigation E2E failure |
| `/configure` | Preview institution, module and palette choices | ConfigurationPreview, BrandSurface | Palette preview is local; align its sample with production patterns | Pending |
| `/design-system` | Inspect approved production UI patterns | ComponentGallery and shared components | Add theme switch and representative portal/auth compositions; document component use | Pending |

## Review rule

Use 1440px desktop and 390px mobile captures for representative pages in every route group. Check 768px, 360px, and 200% browser zoom for shared layout patterns. Capture actual route renders with realistic synthetic data; record native VoiceOver/NVDA separately. A route-family check does not replace functional task verification or owner visual acceptance.
