import {Movie} from '../models/Movie';
import {MovieStar} from '../models/MovieStar';

export interface MovieResponse extends Movie {
    director: MovieStar;
}
