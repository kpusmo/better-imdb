import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Movie} from './models/Movie';
import {Star} from './models/Star';
import {MovieStar} from './models/MovieStar';
import {MovieController} from './controllers/MovieController';
import {MovieService} from './MovieService';

@Module({
    imports: [
        TypeOrmModule.forFeature([Movie, Star, MovieStar]),
    ],
    providers: [MovieService],
    controllers: [
        MovieController,
    ],
})
export class MovieModule {
}
