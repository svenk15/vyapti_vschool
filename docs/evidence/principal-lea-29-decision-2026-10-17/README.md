# LEA-29 assigned decision evidence

Status: engineering complete for every currently registered owner; direct comparison complete with documented routed-shell/font deviations; human review pending.

Authority: approved Principal explorer workflow **LEA-29 — Approve, reject or return an assigned item**, D03, and the existing Leadership/Coordination LLD. Production entry is `/leadership/decisions/:owner/:id`; the existing route is the documented equivalent of the proposed `/review` suffix and preserves established links.

The registered Coordination owner exposes `VERIFY|RETURN`, never generic approve/reject. The application shows owner facts and version, source-defined actions, a conditional return reason, consequence review, and a final command bound to expected version and stable intent. Coordination rechecks current source, reviewer authority and proposer identity and atomically commits the lifecycle change, audit and receipt. A lost response retries the exact payload/key; changed payload conflicts and revoked authority cannot disclose the result.

No new code was needed after LEA-27 because current source `26fdc0f0216623d654042d4fcc368432156ca126` retained the previously verified detail/recovery composition unchanged. The focused current-source Coordination PostgreSQL suite passed 15/15 and the sequential typed-owner Playwright journey passed 1/1 Chromium and 1/1 mobile. That journey includes final confirmation, response loss, revocation before result lookup, restored-authority exact recovery and one persisted resolution. `pnpm check` passed 210/210 unit tests and all repository gates; production build `uvdcAQaNC1HS8F_B_SCVG` passed.

The copied current-source application review/recovery captures and immutable LEA-29 reference captures were directly inspected. The explorer dialog maps to the established recipe-W route; stage order, action hierarchy, feedback and mobile stacking agree. Persistent production navigation and the documented font exception remain explicit deviations. Native accessibility, actual browser 200% zoom, human acceptance, TEN-03 and production gates remain pending.
