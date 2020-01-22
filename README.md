# Installation
Copy `.env.example` to `.env` - you can change some of environmental variables, but `.env.example` contains configuration
that allows project to run. Then run:

```bash
docker-compose up --build
```

On first launch initialization of MySQL takes more time than usually. This could cause problems with connecting
app to database. If it occurs, shut down imdb-back service and run it again.

# Seed
On project startup database is being migrated and fed with entities that app requires to work properly (for example 
admin@admin.com user). To seed fake data (e.g. fake users, movies, stars) run:

```bash
npm run console db seed fake
```

All fake users have password `test`.

# Tests
To run all tests run:

```bash
npm run test
```

Tests use `database-tests` service from `docker-compose.yml`. It is initialized before each test and dropped afterwards.

## Dates in tests
When comparing endpoint result with entities created in tests, tests do not pass due to dates differences - 
in endpoint results dates are stored as strings, and in entities they are `Date` objects. This is why entities
are parsed to json string and then parsed back to plain objects in some tests 
(like in example below taken from `MovieController.e2e-spec.ts`):

```ts
return request(app.getHttpServer())
    .get('/movies/' + movie.id)
    .expect(200)
    .expect(JSON.parse(JSON.stringify(movie)));
```

TypeORM handles transforming `Date` objects to MySQL `DATE` format (`yyyy-MM-dd`). In tests conversion from entity's 
`Date` object to formatted string also has to occur explicitly (example from the same test suite):

```ts
movie.premiereDate = format(movie.premiereDate, 'yyyy-MM-dd');
movieStar.star.birthDate = format(movieStar.star.birthDate, 'yyyy-MM-dd');
movieStar.star.deathDate = format(movieStar.star.deathDate, 'yyyy-MM-dd');
```

# Endpoints
## Authentication
### POST /login
accepts:
```
{
    email: string,
    password: string
}
```
returns:
```
{
    accessToken: string, // enables user to call guarded endpoints
    refreshToken: string, // enables user to refresh access token without login with email and password again
    expiresIn: number // minutes to accessToken expiration
}
```

### PUT /refresh-token
Returns new access token based on received refresh token (if it is valid and not expired)

accepts:
```
{
    token: string
}
```
returns:
```
{
    accessToken: string,
    refreshToken: string,
    expiresIn: number
}
```

## User
### GET /users
Returns user list. Requesting user must be authorized as admin.

accepts (as query string parameters):
```
{
    perPage: number | 'ALL',
    page: number,
    sort: string
}
```
returns:
```
{
    perPage: number | 'ALL',
    page: number,
    total: number,
    data: User[]
}
```

## Movie
### GET /movies
Returns movie list. Accessible for all authenticated users.

accepts (as query string parameters):
```
{
    perPage: number | 'ALL',
    page: number,
    sort: string
}
```
returns:
```
{
    perPage: number | 'ALL',
    page: number,
    total: number,
    data: Movie[]
}
```

### GET /movies/:movieId
Returns movie details. Accessible for all authenticated users.

returns Movie object