import {Injectable, NotFoundException} from '@nestjs/common';
import {Repository} from 'typeorm';
import {Movie} from '../models/Movie';
import {InjectRepository} from '@nestjs/typeorm';

@Injectable()
export class MovieService {
    constructor(
        @InjectRepository(Movie) private readonly movieRepository: Repository<Movie>,
    ) {
    }

    async findMovieById(id: number): Promise<Movie> {
        const movie = await this.movieRepository.findOne({
            where: {
                id,
            },
            relations: ['starring', 'starring.star'],
        });
        if (!movie) {
            throw new NotFoundException('Movie not found');
        }
        return movie;
    }
}
