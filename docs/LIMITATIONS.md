# Known Limitations

1. The execution environment used to build this project has no Docker daemon and no external package registry access, so Docker runtime and React dependency installation could not be exercised here.
2. OpenAlex is a live external service; availability and rate limits depend on network/provider policy.
3. PatentsView currently requires an API key and its documentation states new key grants are temporarily suspended. The project therefore does not fabricate credentials. The default patent provider is a small, clearly labelled public-data snapshot containing a real public patent record. Switch to the PatentsView provider only when legitimate credentials are available.
4. MongoDB raw-document persistence is best-effort when MongoDB is unavailable; normalized application data remains in PostgreSQL.
5. SQLAlchemy `create_all` is used for the standalone Release initialization. Production schema evolution should use Alembic in a later hardening pass.

The bundled patent snapshot contains two records taken from public Google Patents pages: US8126832B2 ("Artificial intelligence system", Cognitive Code Corp, filed 2008-03-06) and US7861317B2 ("Nose cover"). It is included only as a transparent offline demonstration dataset; it is not presented as a live API feed. Source pages are linked from each record's `source_url` field.
