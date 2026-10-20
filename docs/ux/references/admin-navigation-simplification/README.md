# Administrator quiet-workspace navigation preview

Open `NAVIGATION_PREVIEW.html` or use `http://127.0.0.1:3415/NAVIGATION_PREVIEW.html` while the local static server is running. It is an isolated design reference, not an application route. It uses fictional content, performs no API calls and saves nothing.

The visual authority for the Students desktop composition is selected [Concept 1](../student-concepts/concept-1.svg), measured at its native 1440×920 canvas. The accepted FIRST Student registration reference remains authoritative for the separate focused registration route in `../registration-approved/APPROVED_REGISTRATION.html`.

The preview demonstrates:

- the six proposed direct primary destinations and conditional School services;
- open Students Directory, Admissions and Imports destinations using URL-backed links and browser history;
- contextual Directory registration, Admissions application and Imports upload actions;
- separate Staff Profiles / Access / Availability navigation;
- 900px, 390px and 360px responsive adaptations;
- preferred/fallback and omission behavior through labelled simulated access profiles;
- Forest plus the three existing theme token sets.

The compact text navigation uses route links with `aria-current="page"`; it does not use ARIA tab semantics. One authorized child omits the redundant switcher and is named in the heading. No authorized child omits the primary area. Mobile is a proposed extension and human review remains pending.

The access-profile selector is a labelled simulation of the current server visibility contracts. It is not authenticated authorization evidence. Production endpoints must retain their independent authorization.

The preview loads the repository's bundled Inter 4.1 asset through `InterVariable.woff2`, a relative symlink to `app/fonts/InterVariable.woff2`; its SIL Open Font License remains at `app/fonts/LICENSE.txt`. The review-controls disclosure is not product UI and is hidden from comparison screenshots.
