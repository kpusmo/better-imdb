import {Injectable} from '@nestjs/common';
import {Seeder} from '../../../abstracts/Seeder';
import {InjectConnection, InjectRepository} from '@nestjs/typeorm';
import {Movie} from '../models/Movie';
import {Connection, Repository} from 'typeorm';
import * as faker from 'faker';
import {Star} from '../models/Star';
import {MovieStarAppearanceType} from '../enums/MovieStarAppearanceType';
import {MovieStar} from '../models/MovieStar';
import {randomInRange, range} from '../../../helpers/helpers';

@Injectable()
export class MovieSeeder extends Seeder {
    private static MOVIE_COUNT = 10;
    private static STAR_COUNT = 20;
    private static MOVIE_STAR_COUNT = 8;

    constructor(
        @InjectRepository(Movie) private readonly movieRepository: Repository<Movie>,
        @InjectRepository(Star) private readonly starRepository: Repository<Star>,
        @InjectRepository(MovieStar) private readonly movieStarRepository: Repository<MovieStar>,
        @InjectConnection() private readonly connection: Connection,
    ) {
        super();
    }

    async seed(includeFake: boolean): Promise<any> {
        if (!includeFake) {
            return;
        }
        const movies = await this.movieRepository.save(this.fakeMoviesData);
        const stars = await this.starRepository.save(this.fakeStarsData);
        await this.seedMovieStars(movies, stars);
    }

    private async seedMovieStars(movies: Movie[], stars: Star[]) {
        const movieStars: Array<Partial<MovieStar>> = [];
        for (const movie of movies) {
            const director = stars[randomInRange(stars.length)];
            movieStars.push(this.generateMovieStar(movie.id, director.id, MovieStarAppearanceType.director));

            const actorCount = randomInRange(Math.min(stars.length, MovieSeeder.MOVIE_STAR_COUNT));
            for (const i of range(actorCount)) {
                const star = stars[randomInRange(stars.length)];
                movieStars.push(this.generateMovieStar(movie.id, star.id, MovieStarAppearanceType.actor));
            }
        }
        await this.movieStarRepository.save(movieStars);
    }

    private generateMovieStar(movieId: number, starId: number, appearanceType: MovieStarAppearanceType): Partial<MovieStar> {
        return {
            movieId,
            starId,
            type: appearanceType,
            role: appearanceType === MovieStarAppearanceType.actor ? faker.random.words(2) : null,
        };
    }

    private get fakeMoviesData(): Array<Partial<Movie>> {
        const data: Array<Partial<Movie>> = [];
        for (const i of range(MovieSeeder.MOVIE_COUNT)) {
            data.push({
                name: faker.random.words(3) + ': The movie',
                description: faker.random.words(100),
                premiereDate: faker.date.between('01-01-1800', '01-01-2100'),
                metascore: faker.random.number({max: 100, precision: 2}),
                posterPath: faker.system.commonFileName(),
            });
        }
        return data;
    }

    private get fakeStarsData(): Array<Partial<Star>> {
        const data: Array<Partial<Star>> = [];
        for (const i of range(MovieSeeder.STAR_COUNT)) {
            const birthDate = faker.date.between('01-01-1800', '01-01-2100');
            const isAlive = Math.random() < 0.5;
            data.push({
                fullName: faker.name.findName(),
                birthDate,
                deathDate: isAlive ? null : faker.date.future(90, birthDate), // up to 90 years after birth
                picturePath: faker.system.commonFileName(),
            });
        }
        return data;
    }
}
