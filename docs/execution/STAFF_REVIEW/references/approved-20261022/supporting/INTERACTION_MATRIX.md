# Screen and action map

| Surface / action | Result | Data / navigation rule |
|---|---|---|
| Directory / name | Profile | Carry search/filter/sort return state |
| Directory / Manage | Centered shortcut dialog | Show exact selected identity; no mutation |
| Manage / Edit personal details | Personal drawer | Stay on directory; selected Employee/Person never changes |
| Manage / Edit employment details | Employment drawer | Stay on directory; only owner-approved fields editable |
| Manage / Portal action | Current access or setup drawer | Label follows actual state; explicit authorization |
| Directory / Add staff | Focused Add page | Cancel restores directory state |
| Search | Enter applies query | Attribute-specific; no Search button |
| Filters / Sort | Side drawer | Apply commits; Cancel/Escape discard draft |
| Add / Add staff | Profile + focused saved feedback | Production requires confirmed authoritative success |
| Profile / Personal Edit | Personal drawer | Save and Cancel; no global Edit staff |
| Profile / Employment Edit | Employment drawer | Independent owner command; reason required when contract requires |
| Save | In-place refreshed result | No extra confirmation for routine reversible correction |
| Cancel / Escape / Close | Close or dirty-discard guard | Restore trigger focus; no accidental save |
| View assignments | Read-only detail drawer | Existing Academics remains owner of changes |
| Portal setup | Details then review | No preselected access grant; no real message from prototype |
| View invitation / access | Read-only current details | Existing resend/revoke behavior must not be removed in production |
| Recent activity | Inline disclosure | No separate page for basic history |

## Usability acceptance

- Name → Profile: one activation. Manage → edit: two activations, no Profile detour.
- Profile → edit → Save: two action activations excluding typing; no Continue steps.
- Add staff: one page, one submit; no routine review stage.
- No primary duplicate navigation action in a row.
- Save is unavailable when owner fields are unchanged; a reason alone is not an edit.
- Context remains visible inside every dialog/drawer.
- Distinguish readable labels from accessible names: both sections show Edit, screen readers hear the scoped name.
- Do not hide needed consequences merely to reduce copy. Contact email versus sign-in email is a meaningful distinction.

## Production states required beyond this mock

The mock demonstrates ordinary success, validation, no results, duplicate Employee code, unchanged Save, unsaved close, and read-only/setup invitation states. It does NOT simulate real authentication, concurrency, network failures, persistent receipts or email delivery.

Production tests must preserve: current permission checks, foreign-scope denial, exact payload/resource/version/key recovery after UNKNOWN, stale comparison and renewed confirmation, independent draft retention, no second owner Save while an unresolved command is pending where the approved owner contract requires it, and GET-only refresh after confirmed commit. Committed success must never be relabelled failed just because the refresh fails. Native browser zoom and assistive technology evidence require separate verification.
