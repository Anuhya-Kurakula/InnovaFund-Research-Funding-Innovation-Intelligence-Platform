# ResearchSphere AI - UI / UX Wireframes & Page Layouts

## 1. Overview & Visual Design System
ResearchSphere AI utilizes a modern, slate-dark glassmorphism design system featuring curated gradient accents (Indigo `#6366F1`, Violet `#8B5CF6`, Cyan `#06B6D4`), Inter typography, responsive sidebar navigation, dark card contrast, clean stat counters, and micro-interactions.

---

## 2. Page Wireframe Specifications

### 1. Landing Page (`/`)
- **Header**: Logo, Feature Links, Login Button, Register CTA.
- **Hero Section**: Headline ("AI-Powered Research Funding & Innovation Intelligence Platform"), sub-headline, search bar preview, primary CTA ("Get Started Free"), secondary CTA ("Explore Datasets").
- **Metrics Bar**: Live platform counters (Publications Tracked, Patents Cataloged, Grants Identified, Active Researchers).
- **Core Pillars Section**: Cards for Research Intelligence, Patent Analytics, Funding Discovery, Commercialization Scoring.
- **Footer**: Links, copyright, terms.

---

### 2. Login Page (`/login`)
- **Layout**: Centered dark glass card.
- **Fields**: Email Input, Password Input, "Remember Me" checkbox, "Forgot Password?" link.
- **Buttons**: "Sign In" button, "Register an account" redirect link.
- **Validation**: Client-side field validation, backend JWT auth call.

---

### 3. Register Page (`/register`)
- **Layout**: Centered dark glass card with multi-role selector.
- **Fields**: Full Name, Email, Password, Organization Name.
- **Role Selector**: Radio pills for `Researcher`, `Startup Founder`, `Innovation Manager`, `Administrator`.
- **Buttons**: "Create Account" button, "Already have an account? Log in".

---

### 4. Dashboard (`/dashboard`)
- **Header**: Page Title ("Innovation Intelligence Dashboard"), Active Role Badge, Quick Actions.
- **Top Metric Cards**:
  - Research Profiles Count
  - Total Publications Indexed
  - Active Patent Records
  - System Security Status
- **Interactive Widgets**:
  - Recent Dataset Ingestion Feed (OpenAlex, CrossRef, USPTO)
  - Quick Search Bar
  - Quick Navigation Action Tiles

---

### 5. Research Profile Management (`/profile`)
- **Header**: User Avatar, Name, Role, Organization, "Edit Profile" toggle.
- **Profile Sections**:
  - **Bio & Title**: Academic title, short background summary.
  - **Research Domains**: Tag inputs (e.g. *Artificial Intelligence*, *Quantum Computing*, *Bioinformatics*).
  - **Technology Keywords**: Interactive tag manager.
  - **Linked Publications**: List of author papers with DOI links and citation counts.
  - **Linked Patents**: List of patent filings with USPTO / Google Patent links.

---

### 6. Publications Page (`/publications`)
- **Header**: Search Bar, Dataset Source Filter (OpenAlex, CrossRef, Semantic Scholar), Year Range Sorter.
- **Results Grid**: Publication Cards displaying Title, Authors, Journal/Venue, Year, Citation Count, DOI badge, and "Bookmark / Save" button.
- **Detail Modal**: Full metadata display and raw API payload preview.

---

### 7. Patent Page (`/patents`)
- **Header**: Patent Search Input, Assignee Filter, Status Selector (Granted, Pending, Expired).
- **Results Table / Grid**: Patent Title, Patent Number, Assignee Name, Filing Date, Status Pill, Source Badge (USPTO, Google Patents, The Lens).

---

### 8. Admin Dashboard (`/admin`)
- **Header**: Platform Operations & RBAC Control.
- **Tabs**:
  - **User Management**: User list table, role editor modal, deactivate user toggle.
  - **Audit Logs**: Filterable log feed (User, Action, Resource, Timestamp, Details).
  - **API Health**: Status badges for OpenAlex, CrossRef, Semantic Scholar, USPTO, Google Patents, and The Lens APIs.

---

### 9. Settings Page (`/settings`)
- **Sections**: Account Security, Password Reset, API Integration Keys, Notification Preferences.

---

### 10. Navigation Structure
- **Top Navbar**: Brand logo, global search input, quick notification bell, user profile dropdown menu.
- **Sidebar**: Dynamic navigation items rendered according to the active user role.

---

## Educational Breakdown

### 1. What was created
- Defined complete layout, component composition, and interaction behavior for all 10 UI wireframe screens and navigation components.

### 2. Why it is needed
- UI wireframes establish UX patterns before frontend code is built, preventing layout redesigns and ensuring accessibility.

### 3. How it works
- Components are structured into modular layout elements (Navbar, Sidebar, Page Containers, Cards, Modals) mapped to client-side routes.

### 4. Which files were added
- [`docs/UI_UX_WIREFRAMES.md`](file:///c:/Users/mayan/OneDrive/Documents/GitHub/InnovaFund-AI/docs/UI_UX_WIREFRAMES.md)

### 5. How to run it
- View directly in markdown or compare against live React components in `frontend/src/pages/`.

### 6. Industry best practices
- Maintain consistent visual hierarchy, dark mode contrast, clear role-based UI states, and responsive mobile-friendly sidebar navigation.

### 7. Common mistakes to avoid
- Overloading the navigation menu with options that are unauthorized for the user's role.
