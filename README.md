# MKC Immigration Solutions Inc — draft homepage (local only)
Premium demo concept. NOT published/deployed. Source: `site/` · Preview: `dist/index.html` (open statically, relative paths, noindex).
Evidence: `/workspace/research/mkc-immigration-research.md` only. See HTML comments for to-confirm items.

## Logo & hero video (added 2026-10-17)
- Logo: Concept A Heritage Seal, gold-on-navy, identifier `concept-a-leafred` (source `logo-concepts/leaf-red/concept-a-leafred/gold/`). Copied: `site/assets/logo-lockup-dark.svg/.png` (header/footer), `logo-lockup.svg/.png`, `logo-mark.svg`, `logo-app-icon-512.png`; favicons derived from app icon (`favicon.ico`, `favicon-16/32.png`). Temporary/swappable.
- Hero video: Pexels 34178132 "Toronto Skyline with CN Tower by the Lake" by WeStarMoney Rec — https://www.pexels.com/video/toronto-skyline-with-cn-tower-by-the-lake-34178132/ Licence verified 2026-10-17 at https://www.pexels.com/license/ (all Pexels videos free to use/modify, attribution not required; credit in footer as appreciation). Source 3840x2160 30fps 7.5s recompressed locally to `site/assets/hero-toronto.mp4` 1280x720/no audio; poster `site/assets/hero-poster.jpg` (frame at 2s). Higgsfield credits spent: 0.

## Multi-page demo + dashboards (2026-10-18)
### Run preview
Open `dist/index.html` in a browser, or serve the folder: `python3 -m http.server 8000 -d dist` then visit http://localhost:8000 . All paths are relative; dashboards are in `dist/client/` and `dist/owner/`.
### Public pages
`index.html` (Home, hero video), `about.html`, `services.html`, `process.html`, `reviews.html`, `faq.html`, `contact.html`, `login.html`. Chat bot runs on public marketing pages only (not dashboards).
### Demo credentials (displayed on login page; no real auth/backend/security)
- Client: `client@demo.ca` / `client123` -> `client/dashboard.html`
- Owner: `owner@demo.ca` / `owner123` -> `owner/dashboard.html`
Any other credentials show an error. A demo role flag (`mkc_demo_role`) is kept in sessionStorage; dashboard pages redirect to login without the matching role (demo guard only, NOT security). Sign out clears the flag.
### Demo data / reset
Single shared store `site/assets/demo-data.js`, localStorage key `mkc_demo_v2`, seeded once (25 sample clients, 26 applications, sample checklists/tasks/announcements/documents). Use **Reset demo data** on the client dashboard or Profile page to clear and reseed. Editable profile, task checkboxes, checklist state, owner-added applications and documents all save to that same localStorage key.
**Uploads:** the application checklist Upload control is a demo. On change it stores ONLY the file name + Done state in localStorage - file contents/dataURLs are never read or stored. Do not enter real personal information anywhere in this demo.

## Owner admin updates (2026-10-19)
- Store bumped to `mkc_demo_v2`. If `mkc_demo_v1` data exists it is migrated once (clients/applications kept; `Permanent Resident`->`Permanent Residence`, `Student`->`Student Visa`; checklist Done/filename state carried by keyword), otherwise v2 seeds fresh. Reset clears both keys and reseeds v2.
- **Visas are the source of truth** (`owner/visas.html`, in owner nav): canonical types Work Permit, Visitor Visa, Tourist Visa, Permanent Residence, Student Visa, Citizenship, General Consulting. Dropdowns (Add client, Edit client, owner Add application, documents filter) draw from these names. A client application's checklist is derived from its visa's required-documents list, preserving Done/filename by document id; client Tasks missing list follows automatically.
- Seeded visas have sample effective dates/notes and sample required sets using Documents library items (library expanded to 14 sample documents so every required item exists in the picker).
- **Document delete behaviour:** deleting a document (styled demo confirm) also removes it from every visa's required list, so client checklists update consistently.
- Document/client/visa add & edit are accessible modals (dialog roles, Escape closes, focus returns). Document sample uploads and checklist uploads store filenames only.
- The visible Pexels footer credit line was removed from all public pages (2026-10-19); the licence note remains in this README and in an HTML comment on the home page.

## About credentials & portrait (2026-10-19)
- `site/assets/cicc-logo.png` copied from a client-supplied inbox file (288x91 PNG) and shown in an About credentials block with the text `ICCRC#: X123456` labelled visibly as `(demo placeholder - replace with verified CICC licence no.)`. This is a DEMO PLACEHOLDER, not verified — replace with Morris's verified CICC licence number after checking the CICC Public Register before any real use.
- `site/assets/morris-portrait.jpg` (now 1000x800, 5:4): originally a non-generative local polish; on 2026-10-19, with John's approval, ONE Higgsfield `generate_image` edit (`gpt_image_2_5`, 0.25 credits; balance 1000 -> 999.75) changed the clothing to a navy suit/white shirt/navy tie from the original inbox portrait. Face/hair/expression verified visually unchanged. Do not describe it as an unedited photograph. Raw inbox files are not committed.
- Portrait update 2026-10-19 (John approved): shoulders **AI-extended** with Higgsfield FLUX.2 Pro Outpaint (1.32 credits; an earlier 1.32-credit attempt was rejected for dropping the tie), then the tie/closed collar **AI-edited** with `gpt_image_2_5` (0.25 credits). Background cut out locally with rembg `birefnet-portrait` onto pure #ffffff; no drop shadow. Total Higgsfield spend on the portrait: 3.14 credits (balance 1000 -> 996.86).

- Documents no longer carry an application type (2026-10-19): the modal field, table column, and the old type filter were removed (the filter only filtered by document type, so it no longer made sense). A document becomes a requirement only via a visa's required list on the Visas page; the Documents table instead shows a derived 'Required for (visas)' column. New/edited documents are saved with no `type`/`applicationType` field; on load, legacy `type`/`applicationType` fields on stored documents are stripped and the cleaned store is saved back.

## Effective dates replace due-date pickers (2026-10-19)
- Owner Add-application flows (Add Client modal, Edit Client "Add an application", and the owner dashboard "+ Add new application" form for consistency) no longer have a free Due-date picker. Each has a Visa type dropdown (distinct types from Visas data) plus an **Effective date** dropdown listing the effective dates of the visa *records* of that type, newest first; the option value is the visa record id. One date is preselected; if a type has no record with a valid effective date, the dropdown shows "No effective date yet" and saving is **blocked** with an accessible error ("a visa with an effective date is needed first").
- New applications store `type` + `visaId` + `effectiveDate` and **no** `due` field. Client checklists derive from the `visaId` record's required list when present, falling back to the first record matching the type for legacy apps. On load, legacy apps without `visaId` are migrated to the first visa record matching their type (+ its effective date). Displayed application dates now read "Effective <date>" (from the app's effectiveDate/visa record, else —).
- Remaining due-date usages, deliberately: (1) owner-assigned **Tasks** keep their own due dates (they are tasks, not applications); (2) seeded sample applications keep a legacy internal `due` field used ONLY for the owner dashboard's sample Overdue list — new applications have no `due` and never appear there. The overdue section is labelled to say this.

## Pathway imagery (2026-10-19)
- `site/assets/path-{visit,study,work,settle}-{560,960}.webp`: cropped (headline text removed) from John's existing Higgsfield generation 806866fb-d7c2-4ca6-82c9-a646619b7ab3 (2x2 "Canada" panel image). AI-generated, no real people; shown with an "Illustrative image" badge. No credits spent.

## Canada imagery (About, Process, FAQ, Reviews, Contact) — Oct 2026
All AI-generated with Higgsfield (John approved, hard cap 30 credits; spent 15.00). Each is badged "Illustrative image"; no real people, text, logos or flags.
- Stills (gpt_image_2_5, 0.25 each): 5153a40c skyline, 5e358c82 maple street (FAQ hero), e4f8f3fa lake/canoe (Reviews break), 0a716778 airport arrivals family from behind (Process side image), 50e8341d lighthouse boardwalk (Contact hero), 628a247e jet over Rockies (FAQ break). `assets/ca-*-{640,1280}.webp`.
- Clips (kling3_0 std 3s, sound off, 4.5 each), ping-pong looped to 6s, 960x538, muted: 29826f8e jet (Process hero), b6eef7d9 lake mist (About hero), 69b556dd skyline (Reviews hero). `assets/clip-*.{webm,mp4}` + `-poster.webp`. Lazy-loaded by `assets/media.js` (IntersectionObserver, preload=none); reduced-motion shows the poster only.
- About section break reuses the existing 806866fb "settle" crop. The homepage hero video is unchanged.

## Seasonal homepage hero (Oct 2026)
`assets/season-hero.js` picks a hero loop from the visitor's local month (fall Sep–Nov, winter Dec–Feb, spring Mar–May, summer Jun–Aug); `?season=fall|winter|spring|summer` overrides. Only the chosen clip is fetched. JS off (`<noscript>`) or a load error falls back to the original `hero-toronto.mp4`; reduced motion shows the season poster only.
All AI-generated with Higgsfield (John approved, hard cap 20; spent 19.00): a gpt_image_2_5 still (0.25) animated with kling3_0 std 3s, sound off (4.5), played forward then reversed to a 6s loop, 1280x720, muted.
- Fall: still 15540db7 → clip 09384c29, a misty autumn lake with red and gold maples. `hero-fall.{webm,mp4}`, `hero-fall-poster.webp`
- Winter: still 92e4a2fa → clip 0ea2a056, a snowy village with warm lights and tiny distant skaters on a frozen pond (no faces)
- Spring: still 40c4b963 → clip a49bc5f8, cherry blossoms in a green city park with a distant skyline
- Summer: still 8bbaec3a → clip f92cc6c2, a lake beach at sunset with a dock and empty chairs
