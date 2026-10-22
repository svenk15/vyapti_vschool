# Frozen Administrator → Staff review reference

Freeze date: 22 October 2026 (Asia/Kolkata)

Baseline checkpoint: `ecc9afc44e1cf7311051cf04797648b7f64ca3bc`

Status: **design/prototype reference frozen; production implementation and human acceptance remain pending**.

## Frozen source

| File | SHA-256 |
| --- | --- |
| `prototype/STAFF_WORKFLOWS.html` | `b64891b45a22ffb48904551dde50c1659080096f73177202ee8d85709f0dc998` |
| `prototype/STAFF_WORKFLOWS.js` | `8fd6dc6d7bf4a07175c85df5058235bf4eb7920316a919fc3a1807b78eda1601` |
| `prototype/assets/InterVariable.woff2` | `693b77d4f32ee9b8bfc995589b5fad5e99adf2832738661f5402f9978429a8e3` |
| `prototype/assets/LICENSE.txt` | `262481e844521b326f5ecd053e59b98c8b2da78c8ee1bdbb6e8174305e54935a` |

Combined SHA-256: `67ca61b0204bac68c7bc7602e02b3c638305b448d377e79be4bbff9cce474a01`.

The combined hash is the SHA-256 of the raw bytes concatenated in the table order. It covers the executable prototype and its local font/license assets. Specifications and evidence retain normal Git provenance because changing them does not change the executable prototype hash.

Focused evidence manifest: `prototype/evidence-operation-recovery/inspection.json`, SHA-256 `79dd33bff10f74725c6cedcadea5dc84d8d0bf96d57998152f049fddf3fc11cc`.

## Frozen interaction rule

When either Personal or Employment correction is `UNKNOWN`:

- the pending section, target, submitted values, expected version and original request key remain immutable;
- both sections remain editable and survive Close/reopen;
- both Save actions remain disabled;
- the screen says “Check the pending change before saving another.”;
- exact recovery resolves only the pending owner operation;
- resolution re-enables Save so the other section can start an independent operation;
- repeated recovery cannot duplicate a field change or history entry;
- confirmed-save/failed-refresh remains confirmed and uses read-only refresh recovery.

## Authority boundary

The prototype contains fictional in-memory records and reviewer-labelled simulations. It grants no production authority. PD-STF-01, PD-STF-02 and PD-STF-03 remain awaiting explicit approval. PD-STF-04/rejoining remains deferred. Human visual acceptance is PENDING.
