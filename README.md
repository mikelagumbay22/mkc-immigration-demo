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

## Unique imagery pass (Oct 2026)
Every image is now used on exactly one page (a video's poster counts as its clip). New gpt_image_2_5 stills, 0.25 each, 1.75 total:
- Services strip: 179f9ec1 Atlantic cove (Visit), f0e4ae09 stone campus quad (Study), 160b1eef bright office (Work), edee4e5e family home porch (Settle) → `svc-*-{560,960}.webp`
- About break 35c4b225 riverside park; Reviews break 6ba12656 cafe table; FAQ break 1b5f8a9c prairie barn → `ca-*-{640,1280}.webp`
- Removed the now-unused `ca-lake-canoe-*` and `ca-rockies-jet-*` stills.

## Cache busting
Every local CSS/JS reference carries `?v=<version>` (currently `20261020a`). Bump it on every publish, e.g.:
`NEW=20261020a; grep -rlE '\.(css|js)\?v=' site --include='*.html' | xargs sed -i -E "s/\.(css|js)\?v=[A-Za-z0-9]+/.\1?v=$NEW/g"`

## Owner dashboard (shadcn-style, Chart.js) — Oct 2026
- **Design system:** `site/assets/owner-shad.css` is a static-CSS copy of shadcn/ui tokens and components: HSL CSS variables, `--radius: 0.5rem`, zinc neutrals, 1px borders, muted-foreground text. It covers Card, Table, Badge (default/secondary/outline/destructive), Pagination, Dialog with a close X, and Button (default/outline/ghost) with focus rings. MKC navy is primary and gold is accent.
- **Scope:** it applies only under `body.shad`, which only `owner/dashboard.html` has. The other owner and client pages still use `dashboard.css`. Static HTML, no React.
- **Charts:** Chart.js 4.5.1 UMD, vendored at `assets/vendor/chart.umd.min.js` (MIT licence alongside), taken from the npm registry tarball. No CDN at runtime.
  - **Recharts-like styling:** dashed horizontal gridlines only, no axis borders, muted ticks, rounded bars, a smooth line with a gold gradient fill, an HTML tooltip card with colour dots, legend dots, and a doughnut with spaced, rounded segments and a centre total.
  - **Accessibility:** animation is off under reduced motion. Each canvas has `role="img"`, an aria-label summary and a visually hidden data table.
- **Data:** everything comes from `mkc_demo_v2`.
  - `data.metrics` (`v:1`) stores monthly revenue and month-end client totals. They're seeded once from a fixed hash seed and are stable across reloads; new months are filled deterministically and stored months are never overwritten.
  - The current month's client total is live (`clients.length`). The Revenue card shows the current month of the revenue chart, plus the 12-month total.
  - The doughnut shows applications with status Active, by visa type.
  - "Awaiting documents" counts applications with required documents still missing, by visa type, the same set as the KPI card.
- **Documents dialog:** the code is shared between Clients (Edit Client cards) and the Dashboard (overdue rows, which add the application details panel).
- **Cases by status** (stacked bar, full-width row of the chart grid): one bar per month for the rolling 12 months, with one segment per status (New, Active, Submitted, Approved, Denied, Cancelled, plus any other status found in the data).
  - **Data:** past months come from `data.metrics.status`, seeded once with a fixed hash and stored. The current month counts live applications, so it adds up to the 26 applications.
  - **Colours:** each segment uses the same colour as the dot on its status badge.
  - **Tooltip and accessibility:** the tooltip lists each status's count and the month total. Like the other charts, it has an aria summary and a hidden data table.

## Requirement sample files

- Owner UI: **owner/documents.html** (document requirements library). The "Sample file" column has Attach sample / View / Replace / Remove; Remove asks for confirmation first. A visa's checklist is built from its requirements, so a sample shows up on every client checklist that includes that requirement.
- Client UI: **client/application.html**. A requirement shows an eye button ("View sample document") only when it has a sample. The dialog previews images inline and PDFs in an `<object>`; any other type shows its name, type and size with a Download button. The dialog has an overlay, a × close button and a focus trap, and Esc returns focus to the button that opened it.
- Storage: files are kept as data URLs inside `mkc_demo_v2` (`documents[].sample = {name,type,size,dataUrl}`). The limit is **1.5 MB per file** (raw size). If the browser's storage is full, the change is rolled back and a clear error is shown.
- Migration `samplesV: 1`: a legacy `sampleFileName` becomes a name-only sample (no preview), and placeholder samples from `assets/sample-seeds.js` are seeded on d1 (PNG), d2 (PDF) and d8 (PNG). All seeds are generated, blank files marked "SAMPLE — NOT A REAL DOCUMENT".

## Standard document file names

Uploaded files are renamed `MKC-{clientCode}-{visaCode}-{docCode}-{YYYYMMDD}.{ext}` (uppercase codes, the date is the upload date, and the extension comes from the uploaded file), e.g. `MKC-C001-WP-PASSPORT-20261019.pdf`. The same name appears in the client checklist, the owner documents modal (including from the dashboard overdue dialog) and Download. Migration `namesV: 1` adds `code` to clients, visas and documents and renames the stored checklist filenames.

- Clients: `c-demo` → C001, `cN` → C(N+1) zero-padded (C002…C025).
- Visas: WP Work Permit, VV Visitor Visa, TV Tourist Visa, PR Permanent Residence, SP Student Visa, CIT Citizenship, GEN General Consulting.
- Documents: d1 PASSPORT, d2 FORMS, d3 PHOTOS, d4 LETTERS, d5 FEES, d6 STUDY, d7 ITINERARY, d8 EMPLOYMENT, d9 FUNDS, d10 INVITATION, d11 LANGUAGE, d12 RESIDENCE, d13 ACCEPTANCE, d14 NOTES. New records without a code get one derived from their name.

On the client checklist, the sample eye button sits inline after the requirement name (tooltip "View sample") and only appears when the owner has attached a sample.

## Client portal update (20261020a)

- **Owner updates carousel** (`client/dashboard.html`): prev/next arrows, dots, swipe on touch, Left/Right keys on the focused viewport, `aria-roledescription="carousel"`/`"slide"` and a polite live region. Autoplay is off by default (Play button, 6 s), pauses on hover or focus, and is hidden under `prefers-reduced-motion`. Notices: Office hours (Mon–Fri 8:00 a.m.–5:00 p.m.), Holiday closure (Fri Dec 25 and Mon Dec 28, 2026 (Boxing Day observed), and Fri Jan 1, 2027), and IRCC processing times. The processing-times notice gives no figures and links to IRCC's official processing-times page.
- **Reset:** the visible "Reset to starting data" buttons are gone. Add `?reset=1` to any dashboard URL to clear `mkc_demo_v2` and reseed; the parameter is then removed from the URL.
- **Multiple files per requirement** (`filesV: 1`): `row.files = [{name, at, status}]`, and `row.seq` is the last `-NN` used (numbers are never reused after a delete). Names follow `MKC-{client}-{visa}-{doc}-{YYYYMMDD}-NN.{ext}`. Existing single files were migrated to `-01`. Clients can remove their own uploads.
- **Review status:** when every required document has at least one upload, the application moves to **Review** (from New/Active/Submitted; the earlier status is kept in `reviewFrom`). If a file is removed and the set is no longer complete, it goes back to that earlier status. Review has a teal pill (#0f766e) and appears in the owner charts (including Cases by status), the legend and the Clients status filter.
- **Owner documents modal** (Clients page and the dashboard overdue dialog): one row per uploaded file, with a status dropdown (Received / Pending review / Approved / Rejected) that saves immediately, and a trash button with a confirm dialog. After a delete, the counts, the missing list and the Review status update.
- **Tasks page:** a shadcn-style table (task, application, due date, status badge, action) that becomes stacked cards below 720px.
- **Copy cleanup** (`copyV: 1`): "(sample)" was removed from document and requirement names. Clients now have fictional names (C001 Amara Okafor; C002–C025: Priya Sharma, Mateo Fernández, Wei Chen, Fatima Al-Sayed, Liam O’Connor, Aiko Tanaka, Kwame Mensah, Sofia Rossi, Arjun Patel, Nadia Haddad, Diego Morales, Mei Lin Wong, Oluwaseun Adeyemi, Elena Petrova, Hassan Rahimi, Gabriela Silva, Tomasz Nowak, Ananya Iyer, Jamal Williams, Yuki Nakamura, Carmen Ortiz, Daniel Kim, Leila Moradi, Samuel Osei). Visa notes and task titles no longer say "Sample". The seeded sample email addresses are left as they are (standing rule).
- **Images** (AI-generated with Higgsfield `gpt_image_2_5`, 0.25 credits each, 0.75 total; balance 951.61 → 950.86; no people, text or logos; disclosed in the alt text and in HTML/JS comments):
  - `client-welcome(-640).webp`: dashboard welcome banner (job 1af5bcfb)
  - `client-app-header(-640).webp`: application header (job e97b73c6)
  - `client-empty(-240).webp`: empty states (job 150cfd0a)

## Client emails (20261020a)

Migration `emailsV: 1` rewrites seeded client emails to `firstname.lastname@example.com` (lowercase ASCII, accents stripped, apostrophes and spaces dropped), e.g. amara.okafor@example.com, mateo.fernandez@example.com, liam.oconnor@example.com, meilin.wong@example.com. It only changes emails that still match the old seeded pattern (`client@demo.ca` for C001, `sampleNN@demo.ca` for the others), so emails edited by the user are kept. It runs once, after the name migration. The demo logins (client@demo.ca / client123, owner@demo.ca / owner123) are hard-coded in `login.html` and do not depend on C001's stored email, so they still work. The add-client placeholder is now name@example.com.
