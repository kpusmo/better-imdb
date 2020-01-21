# Installation
Copy `.env.example` to `.env` - you can change some of environmental variables, but `.env.example` contains configuration
that allows project to run. Then run:

```bash
docker-compose up --build
```

On first launch initialization of MySQL takes more time than usually. This could cause problems with connecting
app to database. If it occurs, shut down imdb-back service and run it again.

# Seed
On project startup it seeds database with entities that app requires to work properly (for example admin@admin.com user).
To seed fake data (e.g. fake users, movies, stars) run:

```bash
npm run console db seed fake
```

All fake users have password `test`.
