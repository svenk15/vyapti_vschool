# Administrator experience revamp — Staff, School and Academics

Source under test: `1671c8f` plus the focused Staff/School presentation changes committed with this evidence. Production build ID: `1sJKuM3xQ6g6rInKOAmLL`.

## Direct inspection

The following populated application routes were captured from the production server at `http://127.0.0.1:3400` with the existing synthetic Administrator account. Desktop captures use 1440×1000 CSS pixels; mobile captures use 390×844 CSS pixels. Each route returned HTTP 200 and had no root horizontal overflow.

- Staff profiles: `staff-profiles-desktop.png`, `staff-profiles-mobile.png`
- Staff access: `staff-access-desktop.png`, `staff-access-mobile.png`
- Operational availability: `staff-availability-desktop.png`, `staff-availability-mobile.png`
- School setup: `school-setup-desktop.png`, `school-setup-mobile.png`
- School details: `school-details-desktop.png`, `school-details-mobile.png`
- Academics: `academics-desktop.png`, `academics-mobile.png`
- Teacher assignments: `teacher-assignments-desktop.png`, `teacher-assignments-mobile.png`

The screenshots were visually inspected. Staff local navigation now follows the page title, uses one active tab, and replaces duplicate header cross-links. School details no longer advertises unsupported durable draft persistence. The long Academics page remains intentionally content-driven because its existing controls form one authorized setup surface; no owner behavior or data was removed for presentation density.

## Verification

- Focused ESLint on six changed TypeScript/TSX files: passed.
- TypeScript (`pnpm exec tsc --noEmit --pretty false`): passed.
- Production build with the established 4 GiB Node heap: passed.
- Sequential Playwright capture using installed Chromium: 14/14 route/view combinations returned HTTP 200 with no root overflow.
- Database/schema/migrations: unchanged.
- Functional/security evidence: reused from the owning modules because this slice changes only composition and copy.

Human visual acceptance remains **PENDING**. Native VoiceOver/NVDA evidence and TEN-03 remain separate release gates.
