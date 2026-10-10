# Typography: declared fonts versus rendered fonts

The Administrator body declares:

```css
font: 14px/1.5 Inter, ui-sans-serif, system-ui, -apple-system,
      BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

The source does not embed an Inter body font. Its rendered font therefore depends on installed fonts and operating system. Computed font-family alone does not prove Inter rendered. This is an unresolved portability defect in the reference, not permission to select any visually similar font.

The enhanced sidebar embeds two OpenType fonts under the CSS family “VSchool Navigation”, weights 400 and 600. The extracted binaries retain exact bytes and hashes in sources/VSchool_School_Admin_Design/fonts.json. Internal font names can differ from the CSS alias. Retain copyright/license provenance before distributing assets in an application. Extraction is not a new font license grant.

## Required implementation procedure

1. On the user's reference environment, use browser rendered-font inspection for body heading, input, table name and sidebar text. Record the actual font, weight, browser/OS and CSS values.
2. Inspect production for the same elements. Check network/font loading, available weights and inherited overrides; fix wrong weight/fallback sources.
3. For reproducible cross-platform body typography, settle the intended redistributable font asset with a reference preview. Do not silently bundle Inter and claim it must reproduce a screenshot that may use a system fallback.
4. After that decision, pin font file hashes, weights and loading strategy in the live shared tokens; update reference baseline intentionally. Do not apply the sidebar font to the whole application just because it is embedded.
5. Wait for document.fonts.ready before screenshots and assert expected faces loaded. Record actual rendered fonts where tooling allows. Do not compensate for a wrong font with arbitrary spacing.

Current environment measurements in administrator/reference/environment.json are Linux-specific reference evidence. They do not establish the exact font rendered on the user's Mac. This edition preserves the original appearance/source instead of making an unapproved global font change.

Observed in this run: body heading and student-name text rendered DejaVu Sans Bold; navigation rendered embedded Nimbus Sans Regular. These Linux captures are layout evidence, NOT an approved replacement for the user’s Mac font appearance.
