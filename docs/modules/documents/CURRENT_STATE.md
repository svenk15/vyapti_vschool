# Documents / shared file-safety current state

Last updated: 16 October 2026.

Status: **DESIGN_COMPLETE / IMPLEMENTATION_NOT_STARTED / HUMAN_REVIEW_PENDING**.

The approved SA-44 source was reconciled with current Learning, Communication, Parent, Student, Teacher and Administrator matrices. The canonical owner is Documents, not a parallel generic Files module. The package defines approved safety/authorization invariants, exact workflows unlocked, a proposed tenant-scoped schema, quarantine/scanning lifecycle, portable ports, development/production adapter boundaries, safe download delivery, replay/concurrency, retention/cleanup/backup implications and a staged task sequence.

No product code, Prisma schema, migration, database row, storage provider, scanner, public route or demo behavior changed. No upload is represented as safe. Test doubles are explicitly insufficient evidence of malware protection.

Decisions still required before DOC-01/DOC-02 implementation: initial media allowlist and size/count/quota limits; production provider/region/residency/key policy; real scanner/provider SLA and unavailable/retry behavior; quarantine/orphan and purpose-specific retention/legal-hold/deletion policy; server-stream versus short-lived signed delivery. The design recommends a narrow PDF/JPEG/PNG first slice, private S3-compatible storage, a real scanner, same-origin streaming for sensitive first-release documents, and purpose-specific retention, but none of those proposals is marked accepted.

Immediate independently implementable product work remains outside Documents. The next Documents action is to obtain the smallest baseline decisions in DOC-00, then implement the provider-independent foundation without claiming a working upload.
