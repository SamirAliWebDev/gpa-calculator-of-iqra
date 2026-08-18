# Code Quality Improvement Plan

## Overall Rating: 7.5 / 10

Build status: PASS (635.91 kB JS — exceeds 500 kB warning)
Lint warnings: 6

---

## High Impact (moves 7.5 -> 8.5+)

### 1. Fix the `setTimeout` GPA Recalculation
Replace the 3x `setTimeout(() => recalcSemesterGPA(...), 500)` calls in `useGPA.js` with a proper reactive approach. Since Instant DB subscriptions already push real-time updates, the semester GPA should recalculate whenever `data.semesters` changes — not on arbitrary delays. The cleanest way: run `recalcSemesterGPA` inside a `useEffect` that watches the subjects data, or chain the recalc as part of the transaction response.
- File: `src/hooks/useGPA.js:93,111,119`
- Impact: Race conditions if transaction takes >500ms. GPA displays stale data.

### 2. Extract Shared Grade Map
Delete `GRADE_MAP` from `useGPA.js:163-175` and import `GRADE_SCALE` from `utils/gradeScale.js` instead. Single source of truth.
- Files: `src/hooks/useGPA.js:163-175` vs `src/utils/gradeScale.js:1-13`
- Impact: Two identical grade maps = silent bugs if one is updated without the other.

### 3. Eliminate Modal Duplication
Create a reusable `Modal` component with `{ open, onClose, title, children }` props. The 4 modals across `Semesters.jsx` and `SemesterDetail.jsx` (~170 lines of duplicated JSX each) collapse to ~30 lines each.
- Files: `src/pages/Semesters.jsx:126-300` (2 modals, ~174 lines)
- Files: `src/pages/SemesterDetail.jsx:161-338` (2 modals, ~177 lines)
- Impact: 4 nearly identical modals = ~350 lines of duplicated code.

### 4. Share the `fadeUp` Animation Variant
Extract it to `utils/animations.js` and import everywhere. Currently copy-pasted in 8+ files. If you ever change the easing or duration, you'd need to update 8 files — that's fragile.
- Files with identical `fadeUp`: `Home.jsx`, `Login.jsx`, `Register.jsx`, `DashboardHome.jsx`, `Semesters.jsx`, `SemesterDetail.jsx`, `Profile.jsx`, `SemesterCard.jsx`, `SubjectCard.jsx` (9 files)
- Exception: `DashboardHome.jsx` uses `delay: i * 0.1` instead of `i * 0.15` — this may be intentional or an accidental drift.

### 5. Add Error Boundaries
Create a `React.ErrorBoundary` wrapper at the route level (`App.jsx`) and inside the dashboard layout. Catches render crashes and shows a fallback UI instead of a white screen. Also add `.catch()` to all `db.transact()` calls (currently 8 fire-and-forget transactions with zero error handling).
- `db.transact()` with no `.catch()`: `useGPA.js:37,49,68,72,80,104,118`, `Register.jsx:52`, `Profile.jsx:44` (Profile is the only one with try/catch)
- Impact: Unhandled promise rejections. White screen on any DB error.

---

## Medium Impact (moves 8.5 -> 9.0)

### 6. Fix Profile Queries
All 3 profile queries (`DashboardTopbar`, `DashboardHome`, `Profile`) do `{ profiles: {} }` with no `where` filter, then take `[0]`. Should either:
- Filter client-side: `where: { userId: user.id }`
- Or better: create a `useProfile()` hook that encapsulates this pattern so it's written once
- Files: `src/components/layout/DashboardTopbar.jsx:8-11`, `src/pages/DashboardHome.jsx:20-23`, `src/pages/Profile.jsx:19-22`
- Impact: Same query pattern copy-pasted 3 times. No client-side userId filtering (relies entirely on server permissions).

### 7. Add Client-Side Validation
- Credits input should reject `NaN` and enforce `min=0.5, step=0.5` more strictly
- Subject name should reject empty/whitespace-only strings
- Add a guard in `addSubject` / `updateSubject` that validates grade is in `GRADE_OPTIONS`
- Files: `src/pages/SemesterDetail.jsx:39-40,66-67`
- Impact: `parseFloat('abc') || 0` silently creates 0-credit subjects. GPA calculation uses 0-credit entries.

### 8. Remove Dead Code
- Delete unused `strokeColor` in `GPABarChart.jsx:71`
- Delete unused `GraduationCap` import in `DashboardTopbar.jsx:1`
- Fix `SubjectCard.jsx:14` — `qualityPoints` recalculates `gradePoint * credits` when `qualityPoint` is already stored on the entity as `subject.qualityPoint`
- Impact: 3 confirmed dead code instances. Minor bundle bloat + confusion.

### 9. Lazy-Load Dashboard Routes
Wrap `DashboardHome`, `Semesters`, `SemesterDetail`, `Profile` in `React.lazy()` with `Suspense`. The home page loads fast, but the dashboard bundles all pages eagerly. Lazy loading cuts initial bundle size.
- Current JS bundle: 635.91 kB (exceeds 500 kB Vite warning)
- Impact: Users landing on home page download dashboard code they don't need yet.

### 10. Fix the Hero Inline `<style>` Tag
Move the CSS keyframes (`fadeSlideIn`, `marquee`) into `index.css` using Tailwind's `@keyframes` + `@theme` directives, or convert them to Framer Motion variants for consistency with the rest of the app.
- File: `src/components/ui/glassmorphism-trust-hero.jsx:35-56`
- Impact: Injects raw CSS into DOM at runtime. Conflicts with Tailwind's utility-first approach.

---

## Lower Impact (moves 9.0 -> 9.5)

### 11. Add SEO Meta Tags
Add Open Graph tags, meta description, and favicon in `index.html`. For a public app, this matters.
- File: `index.html:1-16` — currently only has `<title>`, no meta description, no OG tags

### 12. Create a `useProfile()` Hook
`DashboardHome.jsx`, `Semesters.jsx` (indirectly via useGPA), and `Profile.jsx` all duplicate the pattern of fetching the user's profile. A shared hook would help.
- This overlaps with item #6 but focuses on the hook extraction specifically.

### 13. Replace `setTimeout` Loading/Success in Profile
`Profile.jsx:46` uses `setTimeout(() => setSaved(false), 2500)` — should use `useEffect` cleanup instead to avoid memory leaks if component unmounts during the timeout.
- File: `src/pages/Profile.jsx:46`
- Impact: Minor memory leak on fast navigation.

### 14. Add `loading` States to Mutations
When a user clicks "Add Subject" or "Delete Semester", the button should disable until the transaction completes. Currently all mutations are fire-and-forget — no loading indicator, no confirmation of success/failure.
- All mutation functions in `useGPA.js` return `void` (except `addSemester` which returns the ID)
- No optimistic UI updates either — the data just "appears" when Instant DB pushes it

### 15. Run `npm run build` and Fix Any Warnings
The oxlint already flagged 6 warnings. Clean those up for a zero-warning build.
- Current warnings:
  - `useGPA.js:128,136,143` — `useCallback` depends on `semesters` which changes every render
  - `AuthContext.jsx:38` — multiple exports (Fast Refresh warning)
  - `DashboardTopbar.jsx:1` — unused `GraduationCap` import
  - `GPABarChart.jsx:71` — unused `strokeColor` variable

---

## Additional Findings from Re-Review

### A. `useCallback` Dependency Issues (oxlint warning)
`useGPA.js:124-143` — `getSemester`, `getSemesterGPA`, and `getOverallGPA` all depend on `semesters` which is a new array reference every render (from `data?.semesters || []`). These `useCallback` hooks never actually memoize. The fix is either:
- Memoize `semesters` with `useMemo` when deriving it from `data`
- Or accept that these are lightweight lookups and remove `useCallback` entirely

### B. `AuthContext.jsx` Multiple Exports
The file exports `AuthProvider`, `useAuth`, AND a default `AuthContext`. The oxlint `only-export-components` warning exists because of the extra exports. This is fine for functionality but breaks Fast Refresh in dev mode. The fix: move `useAuth` to a separate `useAuth.js` file, or suppress the warning since it's a context file.

### C. `index.css` Legacy Theme Tokens
`index.css:6-11` defines `--color-secondary`, `--color-surface`, `--color-text`, `--color-border` which are never used anywhere in the codebase (the app uses Tailwind zinc/white utilities directly). These are dead tokens from an earlier theme iteration.

### D. `DashboardTopbar` Search Bar is Non-Functional
`DashboardTopbar.jsx:34-38` renders a search input with `placeholder="Search semesters..."` but there's no search logic, no state, no filtering. It's purely decorative.

### E. `DashboardTopbar` Bell Notification is Non-Functional
`DashboardTopbar.jsx:43-46` renders a notification bell with a green dot. No actual notification system exists.

### F. `Navbar.jsx` "Get Started" Links to `/login` Not `/register`
`Navbar.jsx:42-43` — both "Log In" and "Get Started" buttons link to `/login`. "Get Started" should likely link to `/register` since it implies new user signup.

### G. `Home.jsx` Has Two Different `fadeUp` Delay Values
`Home.jsx:13` uses `i * 0.15`, but `DashboardHome.jsx:14` uses `i * 0.1`. This is a subtle inconsistency in the animation timing across the app. Could be intentional but likely copy-paste drift.

### H. `SemesterCard.jsx` Inline GPA Color Logic
`SemesterCard.jsx:58` duplicates the GPA color logic inline (`gpa >= 3.5 ? 'text-accent' : gpa >= 2.5 ? 'text-primary' : ...`) instead of using the existing `getGPAColor()` utility from `gradeScale.js`. Same logic, different implementation.

---

## Additional Findings from Final Pass

### I. `Register.jsx:62-63` — Profile Creation Race Condition
After `db.transact()` on line 52, the code immediately calls `navigate('/dashboard')` on line 63 without awaiting the transaction. If the profile transaction is slow, the dashboard will load and query for a profile that doesn't exist yet, causing a flicker or empty state. Unlike `Login.jsx` which awaits `queryOnce` to check profile existence, Register fires-and-forgets the profile creation.
- Impact: Dashboard loads before profile exists → flicker/empty state.

### J. `package.json:15` — Unused Dependency `@studio-freight/lenis`
Lenis smooth-scroll library is in `dependencies` but is never imported anywhere in the codebase. Pure dead weight.
- Impact: Adds to `node_modules` size for no reason.

### K. `GPABarChart.jsx:50` — Redundant GPA Recalculation
The chart calls `calculateGPA(s.subjects || [])` which re-derives grade points from the grade string and multiplies by credits. Each subject already stores `gradePoint` and `qualityPoint` fields — the chart could sum stored values instead of recalculating.
- Impact: Redundant computation. Not a bug but wasteful.

---

## What NOT to do
- No TypeScript migration — the codebase is small enough that JS is fine
- No state management library — React context + `useGPA` hook handles state cleanly enough for this scale
- No testing framework setup — unless explicitly wanted, this is a student tool, not a library

---

## Priority Order for Implementation

| # | Item | Effort | Impact |
|---|------|--------|--------|
| 1 | #2 Extract Grade Map | 5 min | High |
| 2 | #8 Remove Dead Code | 10 min | Medium |
| 3 | #4 Share fadeUp Variant | 10 min | High |
| 4 | #3 Extract Modal Component | 30 min | High |
| 5 | #1 Fix setTimeout Recalc | 30 min | Critical |
| 6 | #5 Add Error Boundaries | 20 min | High |
| 7 | #6 Extract useProfile Hook | 15 min | Medium |
| 8 | #7 Add Validation | 15 min | Medium |
| 9 | #15 Fix Lint Warnings | 10 min | Low |
| 10 | #13 Fix Profile setTimeout | 5 min | Low |
| 11 | #9 Lazy-Load Routes | 15 min | Medium |
| 12 | #10 Move Hero CSS to index.css | 10 min | Low |
| 13 | #11 Add SEO Meta Tags | 10 min | Low |
| 14 | #14 Add Mutation Loading States | 20 min | Medium |
| 15 | Fix F issues (Navbar link, etc.) | 10 min | Low |
| 16 | #I Fix Register race condition | 5 min | Medium |
| 17 | #J Remove unused lenis dependency | 2 min | Low |
| 18 | #K Use stored qualityPoint in GPABarChart | 5 min | Low |

---

*Review completed 2026-07-26 — Full re-audit of all 26 source files + final verification pass*
