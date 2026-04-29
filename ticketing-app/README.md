# Ticketing App (No Docker Compose runtime)

## Structure

```
ticketing-app/
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── db.js
│       ├── eventControllers.js
│       ├── eventRoutes.js
│       └── server.js
├── frontend/
│   ├── Dockerfile
│   ├── index.html
│   └── nginx.conf
├── docker-compose.yml
├── .dockerignore
├── DEPENDENCIES.txt
└── README.md
```

## 1) Create network and volume

```bash
docker network create app-network
docker volume create ticketing-pgdata
```

## 2) Build images

```bash
docker build -t ticketing-backend:1.0 ./backend
docker build -t ticketing-frontend:1.0 ./frontend
```

## 3) Run PostgreSQL container

```bash
docker run -d \
  --name backend_db \
  --network app-network \
  -e POSTGRES_DB=ticketing \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -v ticketing-pgdata:/var/lib/postgresql/data \
  postgres:16-alpine
```

## 4) Run backend container

```bash
docker run -d \
  --name backend \
  --network app-network \
  -p 5000:5000 \
  -e PORT=5000 \
  -e DB_HOST=backend_db \
  -e DB_PORT=5432 \
  -e DB_USER=postgres \
  -e DB_PASSWORD=postgres \
  -e DB_NAME=ticketing \
  ticketing-backend:1.0
```

## 5) Run frontend container

```bash
docker run -d \
  --name frontend \
  --network app-network \
  -p 8080:80 \
  ticketing-frontend:1.0
```

Open: `http://YOUR_VM_IP:8080`

## 6) Test API and database persistence

### Create an event

```bash
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -d '{"title":"Dev Conference","location":"Austin","eventDate":"2026-05-20"}'
```

### Read events

```bash
curl http://localhost:5000/api/events
```

### Verify rows directly in PostgreSQL

```bash
docker exec -it backend_db psql -U postgres -d ticketing -c "SELECT id,title,location,event_date,created_at FROM events ORDER BY id DESC;"
```

If you can see inserted rows, your Node/Express API is correctly storing data in PostgreSQL.

## 7) Restart test (persistence)

```bash
docker restart backend backend_db frontend
docker exec -it backend_db psql -U postgres -d ticketing -c "SELECT count(*) FROM events;"
```

Count should remain unchanged because data is in `ticketing-pgdata` volume.
