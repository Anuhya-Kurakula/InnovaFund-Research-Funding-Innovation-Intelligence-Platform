# Testing Documentation

## Automated backend suite
The suite covers:
- registration
- duplicate registration
- login
- wrong password
- missing/invalid token
- current user
- administrator access
- researcher denial of administrator endpoint
- profile creation/read/update
- duplicate normalized profile values
- invalid research history
- publication search adapter behavior
- publication persistence/association and duplicate association
- patent search and persistence/duplicate association
- health endpoint

Run:
```bash
cd backend
PYTHONPATH=. pytest -q
```

## External APIs
External network calls are isolated behind provider classes. Automated tests replace the OpenAlex network call with a deterministic test response. Patent tests use the clearly labelled local public-data snapshot because live patent providers may require credentials or network access.

## Manual smoke test
1. Start PostgreSQL and MongoDB.
2. Start FastAPI and open `/docs`.
3. Register a Researcher.
4. Login and copy the bearer token in Swagger Authorize.
5. Create a research profile.
6. Add domains/interests/keywords/technology areas.
7. Add organization and academic information.
8. Add research history.
9. Search OpenAlex and save a result.
10. Search patents using the configured provider and save a result.
11. Create/promote an Administrator and verify `/admin/users` is denied to Researchers and available to Administrators.
