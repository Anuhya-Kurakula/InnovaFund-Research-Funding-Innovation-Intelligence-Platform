# API Documentation — Release

Base path: `/api/v1`

## Auth
- `POST /auth/register` — create a Researcher account.
- `POST /auth/login` — OAuth2 password-form login, returns JWT bearer token.
- `GET /auth/me` — current authenticated user.
- `POST /auth/logout` — client-side token disposal acknowledgement; access tokens are short-lived.

## User profile
- `GET /users/me/profile`
- `PUT /users/me/profile`

## Research profile
- `POST /profile`
- `GET /profile`
- `PUT /profile`
- `POST /profile/domains`
- `DELETE /profile/domains/{item_id}`
- `POST /profile/interests`
- `DELETE /profile/interests/{item_id}`
- `POST /profile/keywords`
- `DELETE /profile/keywords/{item_id}`
- `POST /profile/technology-areas`
- `DELETE /profile/technology-areas/{item_id}`
- `POST /profile/research-history`
- `DELETE /profile/research-history/{item_id}`

## Publications
- `GET /publications/search?q=...&author=...`
- `GET /publications/{external_id}`
- `POST /profile/publications`
- `GET /profile/publications`

## Patents
- `GET /patents/search?q=...`
- `POST /profile/patents`
- `GET /profile/patents`

## Administrator
- `GET /admin/users`
- `PATCH /admin/users/{user_id}/role`
- `PATCH /admin/users/{user_id}/status`

## System
- `GET /health`
- `/docs`
- `/redoc`
