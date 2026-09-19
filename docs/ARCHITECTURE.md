# Architecture — Release

## Layers
1. React UI: pages, reusable layout, route protection and API client.
2. FastAPI API: HTTP contracts, authentication, RBAC and validation.
3. Services: profile/auth/data persistence logic.
4. Integrations: external provider adapters isolated from business logic.
5. PostgreSQL: authoritative application data and relationships.
6. MongoDB: raw external records when MongoDB is available.

## Authentication
FastAPI's OAuth2PasswordBearer dependency protects APIs. Login accepts the OAuth2 password form and returns a signed JWT access token. The token contains user ID, role, issued-at and expiration claims.

## Authorization
Role checks are centralized in dependencies. Administrator endpoints require the Administrator role. Profile endpoints always resolve the current user from the validated JWT; IDs supplied by a caller are not used to select another user's profile.

## Data integration
OpenAlex is accessed by an integration adapter. Patent access is provider-based: PatentsView can be configured with a legitimate API key; the default local provider reads a clearly labelled public-data snapshot.

## Milestone boundary
No funding recommendation, grant matching, trend analysis, patent clustering, innovation scoring or commercialization recommendation functionality is implemented.
