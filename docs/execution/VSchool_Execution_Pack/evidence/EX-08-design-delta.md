# EX-08 design delta

Date: 2026-10-10

- **Reference and routes:** approved School Administrator student directory and student-detail compositions; `/admin/students` and `/admin/students/[id]`.
- **Use cases:** list and search branch students, register a student, explicitly reuse an exact organization Person, inspect detail/history, enroll into an open year, transfer a current placement, and archive an eligible student.
- **Existing seams:** `studentsGateway` calls the portable Students facade and its existing Prisma adapter. Browser DTOs remain in `shared/contracts/students.ts`; Next.js pages and client components remain delivery/presentation code.
- **Reads and writes:** no schema or owner change. Reads retain the scoped Student → Person and Student → Enrollment → Placement → Academics joins. Writes retain the existing guarded Student/People registration, enrollment, transfer, archive, School revision, audit, outbox, and receipt transactions.
- **Authorization and concurrency:** current session, membership, institution/branch, release, entitlement, activation, and owner checks remain in the atomic repositories. BE-04 inspection confirmed that the generic directory/detail path had no assignment input and therefore could not safely interpret a teacher's `student.read` grant. The school-wide list/detail now requires `student.manage`; teacher `student.read` is consumed only by the Attendance-owned assigned-session roster flow after its resource check. Optimistic versions and idempotency keys remain unchanged. A browser school or Person identifier is never authority.
- **Identity selection:** ordinary directory search continues to match branch admission number or student name. Existing-Person reuse remains a separate, authorized, exact full-display-name query returning minimal organization-scoped choices; the administrator must select one explicitly.
- **Presentation change:** make the directory the primary workspace, place **Register student** in the page header, use the shared dialog/form recipe for registration, and compose student summary, dated enrollment history, enrollment, transfer, and archive into consistent shared cards. Guardian linking and unsupported profile editing stay absent.
- **Focused verification:** existing Students unit checks; real PostgreSQL registration/enrollment/transfer suites; Playwright registration, directory/detail, enrollment, transfer/archive, stale/conflict and foreign-scope coverage; desktop/mobile screenshots and overflow/keyboard inspection.
- **Migration and seed impact:** none expected. Existing deterministic demo fixtures already cover Students; rerun `pnpm demo:seed` to verify idempotency after the slice.

No unresolved product or security decision blocks this presentation-alignment slice.
