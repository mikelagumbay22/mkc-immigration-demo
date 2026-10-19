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
- `site/assets/morris-portrait.jpg` (640x800): originally a non-generative local polish; on 2026-10-19, with John's approval, ONE Higgsfield `generate_image` edit (`gpt_image_2_5`, 0.25 credits; balance 1000 -> 999.75) changed the clothing to a navy suit/white shirt/navy tie from the original inbox portrait. Face/hair/expression verified visually unchanged. Do not describe it as an unedited photograph. Raw inbox files are not committed.
