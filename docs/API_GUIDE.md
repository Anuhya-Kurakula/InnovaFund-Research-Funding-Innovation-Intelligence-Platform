# ResearchSphere AI - REST API Endpoint Reference Guide

All API endpoints are served under the `/api` route prefix.

---

## 1. Authentication & Security Endpoints (`/api/auth`)

### `POST /api/auth/register`
- **Description**: Registers a new user account and auto-creates an empty research profile.
- **Request Body**:
  ```json
  {
    "full_name": "Dr. Jane Doe",
    "email": "jane.doe@university.edu",
    "password": "SecurePassword123",
    "role": "researcher",
    "organization": "MIT"
  }
  ```
- **Response**: `200 OK` returning JWT access token and user claims.

---

### `POST /api/auth/login`
- **Description**: Authenticates user credentials and issues a JWT bearer token.
- **Request Body**:
  ```json
  {
    "email": "jane.doe@university.edu",
    "password": "SecurePassword123"
  }
  ```
- **Response**: `200 OK` returning `access_token`, `token_type: "bearer"`, and user details.

---

### `GET /api/auth/me`
- **Description**: Returns profile info for the currently authenticated user.
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`

---

## 2. Research Profile Management Endpoints (`/api/profiles`)

### `GET /api/profiles/me`
- **Description**: Retrieves the research profile, domain interests, technology keywords, publications, and patents for the logged-in user.
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`

---

### `PUT /api/profiles/me`
- **Description**: Updates research title, bio, technology areas, domain interests, and keywords.
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Request Body**:
  ```json
  {
    "title": "Associate Professor of Computer Science",
    "bio": "Specializing in artificial intelligence, neural networks, and deep tech commercialization.",
    "technology_areas": "Artificial Intelligence, DeepTech",
    "research_domains": ["Artificial Intelligence", "Bioinformatics"],
    "keywords": ["deep learning", "drug discovery", "transformers"]
  }
  ```

---

## 3. Publication & Patent Dataset Integration Endpoints (`/api/datasets`)

### `GET /api/datasets/publications/search`
- **Description**: Queries academic publications across OpenAlex, CrossRef, and Semantic Scholar.
- **Query Parameters**:
  - `query` (string, default: `"artificial intelligence"`): Search terms.
  - `source` (string, choices: `all`, `openalex`, `crossref`, `semantic_scholar`): Source filter.
  - `limit` (integer, default: `10`): Number of results.

---

### `GET /api/datasets/patents/search`
- **Description**: Queries global patent records across USPTO, Google Patents, and The Lens.
- **Query Parameters**:
  - `query` (string, default: `"quantum computing"`): Search terms.
  - `source` (string, choices: `all`, `uspto`, `google_patents`, `the_lens`): Source filter.
  - `limit` (integer, default: `10`): Number of results.

---

## 4. Admin & System Operations (`/api/admin`)

### `GET /api/admin/users`
- **Description**: Lists registered platform users. Requires `administrator` role.

### `GET /api/admin/audit-logs`
- **Description**: Returns audit event log stream. Requires `administrator` role.

### `GET /api/admin/metrics`
- **Description**: Returns system health status and platform counts.

---

## Educational Breakdown

### 1. What was created
- REST API endpoint reference guide detailing request bodies, query parameters, authorization headers, and response formats across all backend routers.

### 2. Why it is needed
- Frontend developers and external integration partners require an unambiguous contract to interact with backend services.

### 3. How it works
- Documents FastAPI Swagger routes configured in `backend/routers/`.

### 4. Which files were added
- [`docs/API_GUIDE.md`](file:///c:/Users/mayan/OneDrive/Documents/GitHub/InnovaFund-AI/docs/API_GUIDE.md)

### 5. How to run it
- Test endpoints directly in browser via Swagger UI (`http://localhost:8000/docs`).

### 6. Industry best practices
- Standardize REST response status codes (`200 OK`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`).

### 7. Common mistakes to avoid
- Omitting explicit query parameter validation or failing to document required headers.
