import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {MovieStar} from './models/MovieStar';
import {Movie} from './models/Movie';
import {Star} from './models/Star';
import {MovieSeeder} from './seeders/MovieSeeder';

@Module({
    imports: [
        TypeOrmModule.forFeature([Movie, Star, MovieStar]),
    ],
    providers: [
        MovieSeeder,
    ],
    exports: [
        MovieSeeder,
    ],
})
export class MovieSeederModule {
}
