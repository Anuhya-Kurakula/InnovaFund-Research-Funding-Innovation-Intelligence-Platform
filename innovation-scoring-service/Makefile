.PHONY: install seed run test lint docker-build docker-run

install:
	pip install -r requirements.txt

seed:
	python scripts/seed_db.py

run:
	uvicorn app.main:app --host 0.0.0.0 --port 8004 --reload

test:
	pytest tests/ -v --cov=app/core --cov-report=term-missing

lint:
	pytest tests/ -q

docker-build:
	docker build -t innovation-scoring-service .

docker-run:
	docker-compose up --build
