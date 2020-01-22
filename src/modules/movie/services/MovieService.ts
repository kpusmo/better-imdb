import {Injectable} from '@nestjs/common';
import {FindOneOptions, Repository} from 'typeorm';
import {Movie} from '../models/Movie';
import {InjectRepository} from '@nestjs/typeorm';

@Injectable()
export class MovieService {
    constructor(
        @InjectRepository(Movie) private readonly movieRepository: Repository<Movie>,
    ) {
    }

    findOneMovie(options: FindOneOptions<Movie>): Promise<Movie | undefined> {
        return this.movieRepository.findOne(options);
    }
}
