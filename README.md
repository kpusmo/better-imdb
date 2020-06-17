# Installation
Copy `.env.example` to `.env` - you can change some  environmental variables, but `.env.example` contains configuration
that allows project to run. Then run:

```bash
docker-compose up --build
```

On the first launch an initialization of MySQL takes more time than usually. This could cause an error when the 
app tries to the database. If it occurs, shut down the imdb-back service and run it again.

# Admin user
```
email: admin@admin.com
password: test
```

# Seed
On project startup the database is migrated and fed with the entities that the app needs to work properly (for example 
admin@admin.com user). To seed some fake data (e.g. fake users, movies, stars) run following command in `imdb-back` container:

```bash
npm run console db seed fake
```

All the fake users have password `test`.

# Tests
To run all the tests run following command on your host:

```bash
npm run test
```

The tests use the `database-tests` service from `docker-compose.yml`. 
It is initialized before each test and dropped afterwards.

## Dates in tests
When comparing endpoint result with entities created in tests, tests do not pass due to dates differences - 
in endpoint results dates are stored as strings, but in entities they are `Date` objects. This is why entities
are parsed to json string and then parsed back to plain objects in some tests 
(like in example below taken from `MovieController.e2e-spec.ts`):

```ts
return request(app.getHttpServer())
    .get('/movies/' + movie.id)
    .expect(200)
    .expect(JSON.parse(JSON.stringify(movie)));
```

TypeORM handles the transformation `Date` objects to MySQL `DATE` format (`yyyy-MM-dd`). In the tests a conversion
from entity's `Date` object into formatted string also has to occur explicitly (example from the same test suite):

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
    sort: 'users.id|asc', 'users.id|desc', 'email|asc', 'email|desc', 'fullName|asc', 'fullName|desc'
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
    sort: 'name|asc', 'name|desc', 'premiere_date|asc', 'premiere_date|desc', 'metascore|asc', 'metascore|desc'
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
