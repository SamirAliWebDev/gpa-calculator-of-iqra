# CODE_REVIEW Fix Plan — Phased Execution

Execution plan derived from CODE_REVIEW.md (2026-07-26).
Each batch is independently shippable. Revert one batch without touching others.

---

## Batch 1 — Quick Wins (5 files, zero risk)

| Item | What | Files |
|------|------|-------|
| #2 | Delete `GRADE_MAP` from useGPA.js, import `GRADE_SCALE` from gradeScale.js | `useGPA.js` |
| #8 | Delete unused `GraduationCap` import, `strokeColor` variable, fix SubjectCard redundant calc | `DashboardTopbar.jsx`, `GPABarChart.jsx`, `SubjectCard.jsx` |
| F | Change "Get Started" link from `/login` to `/register` | `Navbar.jsx` |

---

## Batch 2 — Shared Utilities (3 files, low risk)

| Item | What | Files |
|------|------|-------|
| #4 | Create `utils/animations.js` with `fadeUp`, delete copies from 9 files | New file + 9 pages |
| A | Remove `useCallback` from `getSemester/getSemesterGPA/getOverallGPA` (lightweight lookups, never memoize) | `useGPA.js` |
| C | Delete unused `--color-*` tokens from `index.css` | `index.css` |

---

## Batch 3 — Component Extraction (6 files, medium risk)

| Item | What | Files |
|------|------|-------|
| #3 | Create reusable `Modal` component, refactor 4 modals | New `Modal.jsx`, `Semesters.jsx`, `SemesterDetail.jsx` |
| #6 | Create `useProfile()` hook, refactor 3 consumers | New `useProfile.js`, `DashboardTopbar.jsx`, `DashboardHome.jsx`, `Profile.jsx` |

---

## Batch 4 — Critical Bug Fixes (4 files, highest risk)

| Item | What | Files |
|------|------|-------|
| #1 | Replace `setTimeout` GPA recalc with `useEffect` on subjects data | `useGPA.js` |
| #5 | Add `React.ErrorBoundary` + `.catch()` on all transactions | `App.jsx`, `useGPA.js`, `Register.jsx` |
| I | Await `db.transact()` in Register before navigating | `Register.jsx` |

---

## Batch 5 — UX Polish (3 files, low risk)

| Item | What | Files |
|------|------|-------|
| #7 | Add validation guards for credits, subject name, grade | `SemesterDetail.jsx` |
| #13 | Fix Profile setTimeout with `useEffect` cleanup | `Profile.jsx` |
| #14 | Add `loading` state to mutation buttons | `useGPA.js`, consumer components |

---

## Batch 6 — Performance & SEO (4 files, low risk)

| Item | What | Files |
|------|------|-------|
| #9 | Lazy-load dashboard routes with `React.lazy` | `App.jsx` |
| #10 | Move hero inline `<style>` keyframes to `index.css` | `glassmorphism-trust-hero.jsx`, `index.css` |
| #11 | Add OG meta tags to `index.html` | `index.html` |
| J | Remove `@studio-freight/lenis` from `package.json` | `package.json` |

---

## Batch 7 — Final Cleanup (3 files, zero risk)

| Item | What | Files |
|------|------|-------|
| H | Replace inline GPA color in SemesterCard with `getGPAColor()` | `SemesterCard.jsx` |
| K | Use stored `qualityPoint` in GPABarChart instead of recalculating | `GPABarChart.jsx` |

---

## Final — Verification

- `npm run build` — confirm zero warnings
- Manual smoke test of all pages

---

*Plan created 2026-07-26 from CODE_REVIEW.md audit*
