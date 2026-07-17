# AGENTS.md

## ⚠️ MANDATORY RULE FOR ALL AGENTS — READ THIS FIRST ⚠️

**YOU MUST READ THIS ENTIRE FILE AT THE START OF EVERY SESSION BEFORE DOING ANYTHING ELSE.**

This is NOT optional. Any agent (human or AI) working on this project MUST:
1. Read this file first using the Read tool before any other action
2. Acknowledge the project conventions, color palette, GPA scale, and file structure
3. Follow ALL rules defined in this file for every task

**Failure to read this file = DO NOT proceed with any task.** This file is the single source of truth for project conventions.

## Iqra University GPA Calculator

### Project
A modern React + Vite web app for Iqra University students to calculate and track GPA across semesters.

### Tech Stack
- React + Vite
- Tailwind CSS v4 (via @tailwindcss/vite)
- Framer Motion (animations)
- React Router DOM (routing)
- Lucide React (icons)
- Instant DB (auth + database)

### Commands
```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview production build
```



### Color Usage Rules
- Dark glass theme is the unified theme for the entire app
- Background: zinc-950 with radial gradient glows per section
- Cards: bg-white/5 border-white/10 hover:bg-white/10 backdrop-blur-sm
- Navbar: bg-zinc-950/80 backdrop-blur-xl border-b border-white/10
- Footer: bg-zinc-950 border-t border-white/10
- Button variants: primary (blue), secondary/glass (white/10), accent (emerald), ghost (zinc-300)
- Light theme colors (secondary, surface, text, border) are legacy — use dark glass tokens instead

### GPA Scale (Iqra University)
A=4.00, A-=3.67, B+=3.33, B=3.00, B-=2.67, C+=2.33, C=2.00, C-=1.67, D+=1.33, D=1.00, F=0.00
- C (2.00) = Minimum for degree
- C- (1.67) = Probation threshold (1.70 SGPA)

### File Structure
```
src/
├── components/
│   ├── layout/     (Navbar, Footer, Layout, DashboardLayout, Sidebar, DashboardTopbar)
│   ├── ui/         (Button, glassmorphism-trust-hero)
│   ├── semester/   (SemesterCard, SemesterForm, SubjectRow)
│   └── auth/       (LoginForm, RegisterForm)
├── pages/          (Home, Login, Register, Dashboard, DashboardHome, SemesterDetail, Profile)
├── hooks/          (useGPA)
├── utils/          (cn, gradeScale, gpaCalculator)
├── context/        (AuthContext)
├── lib/            (db.js - Instant DB client)
├── instant.schema.js   (Instant DB schema)
├── instant.perms.js    (Instant DB permissions)
└── rules.json          (Data isolation rules)
```

### Conventions
- Use `cn()` utility from `utils/cn.js` for className merging
- Framer Motion `fadeUp` variant for scroll animations
- Tailwind v4 `@theme` directive for custom colors
- Functional components only
- No comments in code unless explicitly asked

---

## Instant DB Integration

### Data Model
- `$users` → `profiles` (1:1, via `$user` link)
- `$users` → `semesters` (1:many, via `$user` link, cascade delete)
- `semesters` → `subjects` (1:many, via `semester` link, cascade delete)
- Each entity (`profiles`, `semesters`, `subjects`) has a `userId` string field for ownership

### Schema Fields
| Entity | Fields |
|--------|--------|
| profiles | name, university, userId, createdAt |
| semesters | name, semesterGPA, totalCredits, userId, createdAt |
| subjects | name, credits, grade, gradePoint, qualityPoint, semesterId, createdAt |

### Permissions (Deny-by-Default)
- `$default`: deny all (`allow: { $default: "false" }`)
- `$users`: owner-only access (`auth.id == data.id`)
- `profiles`/`semesters`/`subjects`: owner-only via `userId` field (`auth.id == data.userId`)
- `attrs.$default`: false (prevents client-side schema changes)

### Critical API Facts
- `db.auth.sendMagicCode({ email })` — takes an object, NOT a raw string
- `db.auth.signInWithMagicCode({ email, code })` — correct function name (NOT `verifyMagicCode`)
- Instant IDs are UUID strings — never wrap with `Number()`
- `$` prefix in link labels (e.g., `$user`) causes failures in `where` clauses — use `userId` field instead
- `.js` files must NOT contain TypeScript syntax

### Authentication Flow
1. **Login**: Email → Magic Code → `signInWithMagicCode` → check profile exists → dashboard
   - If no profile found: sign out + show "You don't have an account. Please sign up first."
2. **Register**: Email → Magic Code → `signInWithMagicCode` → create profile with `userId` → dashboard
3. **Sign Out**: `db.auth.signOut()` → redirect to home

### Query Pattern
```js
// Profiles — no where filter, let permissions handle isolation
const { data } = db.useQuery(user ? { profiles: {} } : null)

// Semesters — filter by userId
const { data } = db.useQuery(
  user ? { semesters: { $: { where: { userId: user.id } } } } : null
)

// Subjects — filter by semester.id link
const { data } = db.useQuery(
  { subjects: { $: { where: { semester: { id: semesterId } } } } }
)
```

### Transaction Pattern
```js
// Create with userId stamp
db.transact(
  db.tx.semesters[id()]
    .update({ name: 'Semester 1', userId: user.id, createdAt: Date.now() })
    .link({ $user: user.id })
)

// Update
db.transact(db.tx.profiles[profileId].update({ name: 'New Name' }))

// Delete (cascades to children)
db.transact(db.tx.semesters[semesterId].delete())
```

### GPA Recalculation
- Uses `db.queryOnce()` with `semester.id` link traversal
- Triggered after every subject add/update/delete
- Updates `semesterGPA` and `totalCredits` on the semester entity
