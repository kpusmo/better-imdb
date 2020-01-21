import {INestApplication} from '@nestjs/common';
import {Connection, In, Repository} from 'typeorm';
import {AuthGuardFactory, createMovie, transformDatesToStrings} from '../../../../helpers/testHelpers';
import {Test} from '@nestjs/testing';
import {getConnectionToken, getRepositoryToken, TypeOrmModule} from '@nestjs/typeorm';
import TestDatabaseConfigService from '../../../../database/TestDatabaseConfigService';
import {ConfigModule} from '../../../config/ConfigModule';
import {AuthGuard} from '@nestjs/passport';
import {DatatableModule} from '../../../datatable/DatatableModule';
import * as request from 'supertest';
import {AuthenticationModule} from '../../../authentication/AuthenticationModule';
import {User} from '../../../user/models/User';
import {Movie} from '../../models/Movie';
import {MovieModule} from '../../MovieModule';
import {MovieStar} from '../../models/MovieStar';
import {Star} from '../../models/Star';
import {MovieStarAppearanceType} from '../../enums/MovieStarAppearanceType';
import {format} from 'date-fns';
import {range} from '../../../../helpers/helpers';

describe('MovieController', () => {
    let app: INestApplication;
    let connection: Connection;
    let userRepository: Repository<User>;
    let movieRepository: Repository<Movie>;
    let starRepository: Repository<Star>;
    let movieStarRepository: Repository<MovieStar>;
    const authGuardFactory = new AuthGuardFactory();

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRootAsync({
                    useClass: TestDatabaseConfigService,
                }),
                TypeOrmModule.forFeature([Movie, Star, MovieStar]),
                AuthenticationModule,
                ConfigModule,
                DatatableModule,
                MovieModule,
            ],
        })
            .overrideGuard(AuthGuard('jwt'))
            .useValue(authGuardFactory.getGuard())
            .compile();
        app = module.createNestApplication();
        await app.init();

        connection = module.get(getConnectionToken());
        userRepository = module.get(getRepositoryToken(User));
        movieRepository = module.get(getRepositoryToken(Movie));
        starRepository = module.get(getRepositoryToken(Star));
        movieStarRepository = module.get(getRepositoryToken(MovieStar));
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(async () => {
        authGuardFactory.setFaking(true);
        authGuardFactory.setActivation(true);
        await connection.runMigrations();
    });

    afterEach(async () => {
        // clear database after each test
        await connection.dropDatabase();
    });

    describe('getList', () => {
        it('throws unauthorized on not logged in user', async () => {
            authGuardFactory.setFaking(false);
            return request(app.getHttpServer())
                .get('/movies')
                .expect(401)
                .expect({
                    statusCode: 401,
                    error: 'Unauthorized',
                });
        });

        it('returns paginated, sorted data with relations', async () => {
            const movies = await createMovieStructure(6);
            const sortedMovies = movies.sort((a, b) => b.metascore - a.metascore);
            return request(app.getHttpServer())
                .get('/movies?perPage=2&page=3&sort=metascore|desc')
                .expect(200)
                .expect(async res => {
                    const result = await movieRepository.find({
                        where: {
                            id: In([sortedMovies[4].id, sortedMovies[5].id]),
                        },
                        relations: ['starring', 'starring.star'],
                        order: {
                            metascore: 'DESC',
                        },
                    });
                    expect(res.body).toEqual({
                        perPage: '2',
                        page: '3',
                        total: 6,
                        data: [
                            transformDatesToStrings(result[0]),
                            transformDatesToStrings(result[1]),
                        ],
                    });
                });
        });
    });

    describe('get', () => {
        it('throws unauthorized on not logged in user', async () => {
            authGuardFactory.setFaking(false);
            return request(app.getHttpServer())
                .get('/movies/5')
                .expect(401)
                .expect({
                    statusCode: 401,
                    error: 'Unauthorized',
                });
        });

        it('throws not found on not existing movie', async () => {
            return request(app.getHttpServer())
                .get('/movies/333')
                .expect(404)
                .expect({
                    statusCode: 404,
                    error: 'Not Found',
                    message: 'Movie not found',
                });
        });

        it('returns movie details', async () => {
            const movie = await createMovie(movieRepository) as any;
            const movieStar = await createMovieStar(movie);
            const premiereDate = format(movie.premiereDate, 'yyyy-MM-dd');
            movie.metascore = movie.metascore.toPrecision(4);
            movieStar.star.birthDate = format(movieStar.star.birthDate, 'yyyy-MM-dd');
            movieStar.star.deathDate = format(movieStar.star.deathDate, 'yyyy-MM-dd');
            return request(app.getHttpServer())
                .get('/movies/' + movie.id)
                .expect(200)
                .expect(res => {
                    expect(res.body).toEqual({
                        ...transformDatesToStrings(movie),
                        premiereDate,
                        starring: [transformDatesToStrings(movieStar)],
                    });
                });
        });
    });

    const createMovieStructure = async (n): Promise<any[]> => {
        const movies = [];
        for (const i of range(n)) {
            const movie = await createMovie(movieRepository);
            movie.starring = [await createMovieStar(movie)];
            movies.push(movie);
        }
        return movies;
    };

    const createMovieStar = async (movie: Movie): Promise<any> => {
        const star = new Star();
        star.birthDate = new Date();
        star.deathDate = new Date();
        star.fullName = 'Test Testowy';
        star.picturePath = 'testowa/sciezka/do/miniaturki.jpg';
        await starRepository.save(star);

        const movieStar = new MovieStar();
        movieStar.movieId = movie.id;
        movieStar.star = star;
        movieStar.type = MovieStarAppearanceType.actor;
        movieStar.role = 'Aktor';
        return await movieStarRepository.save(movieStar);
    };
});
