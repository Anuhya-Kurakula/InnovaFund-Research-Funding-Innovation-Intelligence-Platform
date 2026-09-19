# ResearchSphere AI - Database Reference Guide

## 1. Database Architecture Overview
ResearchSphere AI combines **PostgreSQL 16** (Primary Relational Database) and **MongoDB 7** (Secondary Document Database).

---

## 2. PostgreSQL Relational Schemas (11 Tables)

### `users`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | PRIMARY KEY, AUTO | Unique User ID |
| `full_name` | VARCHAR(150) | NOT NULL | User's full name |
| `email` | VARCHAR(150) | UNIQUE, NOT NULL, INDEX | User login email |
| `password_hash` | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| `role` | VARCHAR(50) | NOT NULL, INDEX | User role |
| `organization_id`| INTEGER | FOREIGN KEY -> `organizations.id` | Affiliated organization |
| `is_active` | BOOLEAN | DEFAULT TRUE | Active flag |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Account creation time |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

### `roles`
Stores platform roles (`researcher`, `startup_founder`, `innovation_manager`, `administrator`).

### `research_profiles`
1-to-1 profile record linked to `users.id` storing academic title, bio, and technology areas.

### `research_interests`
Relational entries for research domains linked to `research_profiles.id`.

### `keywords`
Normalized technology keywords associated with a research profile.

### `publications`
Academic paper metadata indexed by DOI, linked to author profile, storing citations and source agency (`OpenAlex`, `CrossRef`, `Semantic Scholar`).

### `patents`
Patent records indexed by patent number, storing assignee, filing date, status, and source agency (`USPTO`, `Google Patents`, `The Lens`).

### `organizations`
Universities, enterprises, startups, and R&D institutions.

### `sessions`
Active user session tokens and IP address audit data.

### `audit_logs`
System security action log stream (`REGISTER`, `LOGIN`, `PROFILE_UPDATE`, `DATASET_SYNC`).

### `notifications`
Alert messages delivered to platform users.

---

## 3. MongoDB Document Collections

- **`raw_publication_payloads`**: Un-normalized JSON objects returned from OpenAlex, CrossRef, and Semantic Scholar APIs.
- **`raw_patent_payloads`**: Un-normalized JSON objects returned from USPTO, Google Patents, and The Lens APIs.
- **`audit_events`**: High-frequency security event stream.

---

## Educational Breakdown

### 1. What was created
- Comprehensive database guide detailing column data types, constraints, relational foreign keys, indexes, and document collections.

### 2. Why it is needed
- Ensures database developers understand relational integrity rules and foreign key cascade behaviors.

### 3. How it works
- Documents the exact schema structure created by SQLAlchemy ORM models in `backend/models.py`.

### 4. Which files were added
- [`docs/DATABASE_GUIDE.md`](file:///c:/Users/mayan/OneDrive/Documents/GitHub/InnovaFund-AI/docs/DATABASE_GUIDE.md)

### 5. How to run it
- Query directly via `psql` or `mongosh`.

### 6. Industry best practices
- Use explicit foreign key constraints (`ON DELETE CASCADE`) to prevent orphaned records in child tables.

### 7. Common mistakes to avoid
- Omitting indexes on foreign key columns, leading to full table scans during JOIN queries.
