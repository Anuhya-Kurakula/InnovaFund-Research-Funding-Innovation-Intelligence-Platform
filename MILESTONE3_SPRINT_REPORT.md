\# Milestone 3 Sprint Report — Member 8 (QA, Integration \& Documentation)



\*\*Branch:\*\* saumyaa-dev

\*\*Sprint:\*\* Week 5 \& 6 — Patent Analytics \& Innovation Intelligence



\## Summary



This sprint focused on extending the shared database layer for the new Milestone 3 modules, running real integration tests against each member's working backend, and coordinating fixes for cross-branch schema conflicts that surfaced as the team's different backend architectures began sharing the same live database.



\## Deliverable 1: Extended Shared DB Connection Layer — Complete



\- Documented the full schema for Patent Landscape (`patent\_records`), Technology Intelligence (`technology\_domains`, `technology\_maturities`, `competitor\_activities`), and confirmed Innovation Scoring / Commercialization currently operate as stateless calculators.

\- Diagnosed and resolved a cross-branch schema conflict affecting the shared `innovafund\_db`: multiple missing/mismatched columns on the `users` table (`password\_hash`, `organization\_id`, `is\_active`, `updated\_at`) caused by two branch lineages diverging early in the project. Wrote and ran three safe, idempotent migration scripts to bring the shared database fully up to date.

\- Verified the fix by connecting a real branch (Kesiya's Patent Landscape module) against the live shared database with zero schema errors.



\## Deliverable 2: Integration Test Suite — Strong Progress



Built and verified real, passing integration test suites across multiple Milestone 3 workflows:



\- \*\*Technology Intelligence + Grant Matching\*\* (Mayank's branch): 13 tests passing, including a new cross-module flow — registration, profile setup, grant matching, and technology intelligence working together end to end.

\- \*\*Patent Landscape Analysis\*\* (Kesiya's branch): 19 tests passing, covering patent search, technology-domain clustering, filing trend analysis, and patent strength scoring.

\- \*\*Backend startup verification\*\* (Anuhya's branch): confirmed the previously blocking application startup issue is resolved — the app now boots successfully after the missing router files and model were restored.



\## Deliverable 3: API Contract Tracking \& Mismatch Flagging — Ongoing, high activity



\- Coordinated directly with Kesiya, Anuhya, and Mayank on database configuration, schema conflicts, and startup issues as they surfaced — each resolved collaboratively with clear root-cause diagnosis.

\- Verified claims against real evidence throughout the sprint (running actual test suites and startup checks rather than relying on self-reported status), ensuring the team's shared understanding of what's working reflects reality.

\- Identified that the team's backend architecture is converging toward a single shared structure (originally developed by Kanishka), which several members have now built on top of — recommending this be formalized as the team standard going forward.



\## Deliverable 4: Documentation



\- `DB\_SETUP.md` — fully updated with all new Milestone 3 table schemas and the resolved schema-conflict history.

\- `QA\_FINDINGS.md` — running log of issues found, root causes, and resolutions across the sprint.

\- This report.



\## Status



Milestone 3 integration and testing is substantially complete — the shared database layer is fully documented and stable, and real integration test coverage now spans Patent Landscape Analysis, Technology Intelligence, and Grant Matching. Final verification of the Innovation Scoring and Commercialization modules is in progress and will be completed shortly.

