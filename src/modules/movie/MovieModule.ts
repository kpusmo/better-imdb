import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Movie} from './models/Movie';
import {Star} from './models/Star';
import {MovieStar} from './models/MovieStar';
import {MovieController} from './controllers/MovieController';
import {MovieService} from './services/MovieService';
import {MovieListService} from './services/MovieListService';

@Module({
    imports: [
        TypeOrmModule.forFeature([Movie, Star, MovieStar]),
    ],
    providers: [MovieService, MovieListService],
    controllers: [
        MovieController,
    ],
})
export class MovieModule {
}
