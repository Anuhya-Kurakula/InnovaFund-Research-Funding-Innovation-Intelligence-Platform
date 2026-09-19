# Database Documentation

## PostgreSQL
PostgreSQL is the primary relational database.

### Core tables
- `users`: identity, password hash, role and status.
- `user_profiles`: user-level profile fields.
- `research_profiles`: one-to-one with users.
- `organizations`: reusable organization records.
- `research_domains`: normalized domain values.
- `research_interests`: normalized interest values.
- `keywords`: normalized keyword values.
- `technology_areas`: normalized technology areas.
- `research_history`: structured historical research entries.
- `publications`: normalized external publication metadata.
- `patents`: normalized patent metadata.
- `profile_publications`: many-to-many profile/publication association.
- `profile_patents`: many-to-many profile/patent association.

## MongoDB
Collections:
- `publications_raw`
- `patents_raw`

MongoDB preserves raw external payloads for future intelligence workflows. The application does not require MongoDB to store normalized relational identity/profile data.

## Initialization
The application initializes SQLAlchemy metadata at startup for the standalone Release project. For a larger production deployment, Alembic migrations should replace `create_all` before schema evolution begins.
