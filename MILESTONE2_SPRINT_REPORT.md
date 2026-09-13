\# Milestone 2 Sprint Report — Member 8 (QA, Integration \& Documentation)



\*\*Branch:\*\* saumyaa-dev

\*\*Date:\*\* 2026-08-20



\## Summary



This sprint focused on setting up shared infrastructure for the team, surveying in-progress backend work across all member branches, and building an integration test suite + documentation against the most complete Milestone 2 implementation found (Anuhya-Kurakula's branch), pending the team's final decision on a shared backend structure.



\## Deliverables completed



\### 1. Shared DB connection layer

\- `backend/.env.example` — template for Postgres + MongoDB connection variables

\- `DB\_SETUP.md` — step-by-step setup guide (Docker Compose, env config, health check)



\### 2. Branch survey \& mismatch flagging

\- Reviewed all 8 remote branches for existing Milestone 2 work

\- Found 3+ independently rebuilt backend structures in parallel (kanishka, Anuhya-Kurakula, mayank), none merged into `main`

\- Flagged this to the team; team agreed to review each member's work before standardizing on one structure

\- Adopted Anuhya-Kurakula's branch as the interim working base for testing (has both funding + trends modules built out, plus existing test coverage)



\### 3. Integration test suite

\- Ran Anuhya's existing 22-test suite; found and fixed a real bug: `save\_patent()` crashed on writing a raw `datetime.date` field to MongoDB (BSON can't encode bare dates)

\- Added 2 new cross-module integration tests (`backend/test\_integration\_workflow.py`):

&#x20; - Full researcher journey: register → profile → save publication + patent → funding recommendations → trends

&#x20; - Cross-user data isolation for funding recommendations

\- Final result: \*\*24/24 tests passing\*\*



\### 4. API contract documentation

\- `backend/API\_CONTRACT\_MILESTONE2.md` — documents all Funding Discovery and Research Trend Intelligence endpoints (paths, auth requirements, request/response shapes), matching the format of kesiya-dev's existing contract doc for consistency



\### 5. QA findings log

\- `QA\_FINDINGS.md` — details the patent-save bug and fix, plus the branch structure divergence issue, for the team's reference



\## Open items / blockers



\- \*\*Backend structure not finalized.\*\* All documentation and tests above are built against Anuhya-Kurakula's branch specifically. Once the team agrees on a shared structure, the DB connection layer, test suite, and API contract doc will need to be re-validated (and possibly adjusted) against whatever is chosen.

\- Coordination with Members 3 \& 5 (Data) on DB access patterns is pending team's structure decision.



\## Files added this sprint



\- `backend/.env.example`

\- `DB\_SETUP.md`

\- `QA\_FINDINGS.md`

\- `backend/test\_integration\_workflow.py`

\- `backend/API\_CONTRACT\_MILESTONE2.md`

\- `MILESTONE2\_SPRINT\_REPORT.md` (this file)

