# Iqra University GPA Calculator - Project Plan

## Project Overview
A modern, smooth web application for Iqra University students to calculate and track their GPA across semesters with a dark glass theme and real-time data via Instant DB.

---

## Tech Stack
| Technology | Purpose |
|------------|---------|
| React + Vite | Frontend framework & build tool |
| Tailwind CSS v4 | Styling & responsive design (via @tailwindcss/vite) |
| Framer Motion | Animations |
| React Router DOM | Client-side routing |
| Lucide React | Icons |
| Instant DB | Authentication & real-time database |

---

## Color Palette — Dark Glass Theme (Active)

The app uses a unified dark glass theme throughout:
```
Base:           zinc-950 (#09090b)
Glass:          white/5, white/10, white/20 (backdrop-blur-xl)
Glass border:   white/10
Text primary:   white
Text secondary: zinc-300
Text muted:     zinc-400
Text faint:     zinc-500
Gradient text:  white → #60a5fa (blue-400 complement)
Primary:        #3B82F6 (Blue-500)
Primary Dark:   #1E40AF (Blue-800)
Accent:         #10B981 (Emerald-500)
Accent glow:    primary at 15% opacity (radial gradient)
Secondary glow: accent at 10% opacity (radial gradient)
Active status:  green-500 with green-400 ping
Premium/crown:  yellow-500
Progress bar:   gradient primary → accent (#3B82F6 → #10B981)
Divider:        white/10
```

### Color Usage Rules
- Background: zinc-950 with radial gradient glows per section
- Cards: bg-white/5 border-white/10 hover:bg-white/10 backdrop-blur-sm
- Navbar: bg-zinc-950/80 backdrop-blur-xl border-b border-white/10
- Footer: bg-zinc-950 border-t border-white/10
- Button variants: primary (blue), secondary/glass (white/10), accent (emerald), ghost (zinc-300)

---

## GPA Grading Scale (Iqra University)
| Grade | Percentage | Grade Points |
|-------|------------|--------------|
| A | 90%–100% | 4.00 |
| A- | 85%–89% | 3.67 |
| B+ | 80%–84% | 3.33 |
| B | 75%–79% | 3.00 |
| B- | 70%–74% | 2.67 |
| C+ | 65%–69% | 2.33 |
| C | 60%–64% | 2.00 |
| C- | 55%–59% | 1.67 |
| D+ | 50%–54% | 1.33 |
| D | 45%–49% | 1.00 |
| F | Below 45% | 0.00 |

**Notes:**
- C (2.00) = Minimum for undergraduate degree requirement
- C- (1.67) = Revised Probation Threshold Limit (1.70 Semester GPA)
- F = Course repeat required

---

## GPA Formula
```
Quality Points = Grade Points × Credit Hours
Semester GPA = Σ(Quality Points) / Σ(Credit Hours)
```

---

## Project Structure
```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Layout.jsx
│   │   ├── DashboardLayout.jsx
│   │   ├── Sidebar.jsx
│   │   └── DashboardTopbar.jsx
│   ├── ui/
│   │   ├── Button.jsx
│   │   └── glassmorphism-trust-hero.jsx
│   ├── semester/
│   │   ├── SemesterCard.jsx
│   │   ├── SemesterForm.jsx
│   │   └── SubjectRow.jsx
│   └── auth/
│       ├── LoginForm.jsx
│       └── RegisterForm.jsx
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── DashboardHome.jsx
│   ├── SemesterDetail.jsx
│   └── Profile.jsx
├── hooks/
│   └── useGPA.js
├── utils/
│   ├── cn.js
│   ├── gradeScale.js
│   └── gpaCalculator.js
├── context/
│   └── AuthContext.jsx
├── lib/
│   └── db.js
├── instant.schema.js
├── instant.perms.js
└── rules.json
```

---

## Page Breakdown

### 1. Home Page (Landing)
- Hero section with animated headline
- Feature highlights with icons
- How it works section (3 steps)
- Call-to-action buttons
- Smooth scroll animations

### 2. Login Page (Magic Code)
- Email input → send magic code
- Code verification step
- Profile check after sign-in (blocks unregistered users)
- Error: "You don't have an account. Please sign up first."
- Link to register

### 3. Register Page (Magic Code)
- Name + email input → send magic code
- Code verification step
- Creates profile with userId on successful sign-in
- Redirects to dashboard

### 4. Dashboard Page
- DashboardLayout with Sidebar + DashboardTopbar
- Welcome message with user name from profile
- Grid of semester cards showing:
  - Semester name/type/year
  - Semester GPA (stored on entity)
  - Number of subjects
- "Add Semester" button
- Cumulative GPA display at top

### 5. Semester Detail Page
- Semester title (name/type/year)
- Dynamic subject table:
  - Subject Name (text input)
  - Credit Hours (number input)
  - Grade (dropdown with all grades)
  - Quality Points (auto-calculated)
- Add/Remove subject buttons
- Real-time GPA recalculation
- All changes persist to Instant DB

### 6. Profile Page
- User avatar (first letter of name)
- Name (editable, saved to profile entity)
- Email (from auth, read-only)
- University (read-only, "Iqra University")
- Save button with confirmation feedback

---

## Authentication Flow
```
1. User visits Home → Clicks "Get Started" or "Login"
2. Login: Email → Magic Code → signInWithMagicCode → profile check → dashboard
   - If no profile: sign out + show "You don't have an account. Please sign up first."
3. Register: Name + Email → Magic Code → signInWithMagicCode → create profile → dashboard
4. Dashboard shows user's semesters (filtered by userId)
5. Sign out from Sidebar → redirect to home
```

---

## Instant DB Integration

### Data Model
- `$users` → `profiles` (1:1, via `$user` link)
- `$users` → `semesters` (1:many, via `$user` link, cascade delete)
- `semesters` → `subjects` (1:many, via `semester` link, cascade delete)
- Each entity has a `userId` string field for ownership

### Schema Fields
| Entity | Fields |
|--------|--------|
| profiles | name, university, userId, createdAt |
| semesters | name, semesterGPA, totalCredits, userId, createdAt |
| subjects | name, credits, grade, gradePoint, qualityPoint, semesterId, createdAt |

### Permissions (Deny-by-Default)
- `$default`: deny all
- `$users`: owner-only (`auth.id == data.id`)
- `profiles`/`semesters`/`subjects`: owner-only via `userId` (`auth.id == data.userId`)
- `attrs.$default`: false

### Critical API Facts
- `db.auth.sendMagicCode({ email })` — takes an object, NOT a raw string
- `db.auth.signInWithMagicCode({ email, code })` — correct name (NOT `verifyMagicCode`)
- Instant IDs are UUID strings — never wrap with `Number()`
- `$` prefix in link labels fails in `where` clauses — use `userId` field instead
- `.js` files must NOT contain TypeScript syntax

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

---

## Implementation Status

### Completed
- [x] Project setup (React + Vite + Tailwind v4)
- [x] Dark glass theme applied throughout
- [x] Home page with hero, features, how-it-works, CTA
- [x] Navbar + Footer with responsive design
- [x] Instant DB client initialized (`src/lib/db.js`)
- [x] Instant DB schema pushed to production
- [x] Instant DB permissions pushed to production
- [x] Magic Code authentication (login + register)
- [x] AuthContext provider wrapping the app
- [x] Dashboard layout (Sidebar + DashboardTopbar)
- [x] Dashboard home page (user greeting, semester cards, cumulative GPA)
- [x] Semester CRUD (add, view, delete with cascade)
- [x] Subject CRUD (add, update, delete with cascade)
- [x] Real-time GPA recalculation on subject changes
- [x] Profile page (view/edit name, display email)
- [x] Login blocks unregistered users with error message
- [x] Data isolation (each user sees only their own data)
- [x] Production build passes

### In Progress
- (none)

### Blocked
- (none)

---

## Future Ideas
- Grade prediction tool ("What grade do I need for X GPA?")
- GPA history graphs/charts
- Export/Print semester report
- Dark mode toggle (light theme available but legacy)
- Semester comparison view
- Target GPA calculator
- Course notes attachment

---

*Plan updated to reflect current implementation state*
