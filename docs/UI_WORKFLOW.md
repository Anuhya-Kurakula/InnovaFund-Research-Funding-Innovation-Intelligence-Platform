# UI Workflow & Page Architecture

## 1. Public Pages

### Landing Page (`/`)
- Brand Hero: "Research Funding & Innovation Intelligence Platform"
- Value propositions & feature highlights (Funding Discovery, Trend Intelligence, Publications & Patents)
- Quick Access CTAs: `[Create Account]` and `[Sign In]`

### Authentication Pages (`/login`, `/register`)
- **Login (`/login`)**: Email/Password JWT auth, role detection, auto-redirect to `/dashboard`.
- **Register (`/register`)**: Full name, email, password, and role selector (`Researcher`, `Startup Founder`, `Innovation Manager`, `Administrator`).

---

## 2. Authenticated Application Shell (`Layout.jsx`)

### Navigation Sidebar
- Brand Logo & Platform Title
- Primary Nav Links: `Dashboard`, `Profile`, `Publications`, `Patents`, `Funding`, `Trends`
- Admin Nav Link: `Admin Management` (Rendered conditionally for `Administrator` role only)
- User Profile Pill & `[Logout]` button

### Top Header Bar
- Title Eyebrow: `RESEARCH INTELLIGENCE`
- Header Actions: Global Search icon, Notifications bell icon, **Theme Switcher** (`Moon` / `Sun` Light & Dark mode toggle)
- Active User Badge with role indicator

---

## 3. Core Modules

### Dashboard (`/dashboard`)
- Personalized Greeting: "Welcome back, `<Name>`" (`<Role>`)
- Key Metric Cards: Profile Completion, Saved Publications, Saved Patents, Recommended Funding Opportunities
- Quick Navigation Tiles: Research Profile, OpenAlex Publications, Patent Intelligence, Funding Opportunities, Trend Intelligence

### Research Profile (`/profile`)
- Academic Info & Organization details form
- Interactive Tag Editors: Research Domains, Research Interests, Keywords, Technology Areas
- Research History Log: Title, Description, Dates, Add/Delete entries
- Asset Summary Counters

### Publications Discovery (`/publications`)
- Live OpenAlex API integration search engine
- Search bar with topic/keyword query input
- Interactive Result Cards: Title, Authors, Publication Year, Open Access badge, DOI link
- One-click `[Save to Profile]` asset bookmarking

### Patent Intelligence (`/patents`)
- Public sample dataset fallback search engine
- Filter by Assignee, Classification, and Legal Status
- Result Cards: Title, Patent Number, Filing/Issue Date, Abstract, Status Tag
- One-click `[Save to Profile]` asset bookmarking

### Funding Opportunity Discovery (`/funding`)
- **Tabs**: `All Opportunities`, `Recommended Matches`, `Funding Alerts`, `+ Add Opportunity` (Admin only)
- Source Type Filters: `Government Grants`, `Research Councils`, `Innovation Funds`, `Startup Accelerators`, `Venture Programs`, `International Funding Agencies`
- Match Score Indicator (% overlap with user profile domains/keywords/tech areas)
- Modal Form for Admin to create new funding opportunities

### Research Trend Intelligence (`/trends`)
- Calculated analytics from stored publication and patent data
- Topic Velocity bar charts & historical velocity selector
- Emerging Research Hotspots table (ranked by growth rate & citation-weighted paper clusters)
- Citation Analytics: Top cited papers, domain citation distribution

### Admin Dashboard (`/admin`)
- Accessible strictly to users with the `Administrator` role
- User Management Table: Full name, Email, Current Role, Role Dropdown editor, Update actions
- System metrics and user counts

---

## 4. Design System & Theme Engine
- **Light & Dark Mode**: Persistent theme preference stored in `localStorage`, toggled seamlessly across all views.
- **Micro-interactions**: Hover effects, smooth transitions, toast feedback on asset save, loading skeletons and empty states.
