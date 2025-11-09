# fortyplusfit Open-source Data Store (PostgreSQL)

This project adds a **PostgreSQL** datastore with multi-tenant schema tailored for an online-only gym (home & public parks) plus South Africa–focused reference data.

## Start
```bash
cd backend
cp .env.example .env
docker compose up -d
# migrations in ./migrations auto-run on first boot
# then seed reference data:
docker exec -i $(docker ps -qf name=db) psql -U fpf -d fortyplusfit < seeds/001_reference_data.sql
```
Adminer UI: http://localhost:8080  (Server: db, User: fpf, Pass: fpfpassword, DB: fortyplusfit)