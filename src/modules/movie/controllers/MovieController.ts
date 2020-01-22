import {Controller, Get, NotFoundException, Param, Query, UseGuards, UseInterceptors} from '@nestjs/common';
import {DatatableService} from '../../datatable/services/DatatableService';
import {GetMovieListTransferObject} from '../transfer-objects/GetMovieListTransferObject';
import {Movie} from '../models/Movie';
import {AuthGuard} from '@nestjs/passport';
import {GetMovieTransferObject} from '../transfer-objects/GetMovieTransferObject';
import {MovieService} from '../services/MovieService';
import {MovieTransformer} from '../interceptors/MovieTransformer';
import {MovieListTransformer} from '../interceptors/MovieListTransformer';

@Controller('movies')
export class MovieController {
    constructor(
        private readonly datatableService: DatatableService<Movie>,
        private readonly movieService: MovieService,
    ) {
    }

    @Get()
    @UseInterceptors(MovieListTransformer)
    @UseGuards(AuthGuard('jwt'))
    async getList(@Query() dto: GetMovieListTransferObject) {
        dto.table = 'movies';
        dto.relations = ['movies.starring', 'starring.star'];
        return await this.datatableService.get(dto);
    }

    @Get(':movieId')
    @UseInterceptors(MovieTransformer)
    @UseGuards(AuthGuard('jwt'))
    async get(@Param() dto: GetMovieTransferObject) {
        const movie = await this.movieService.findOneMovie({
            where: {
                id: dto.movieId,
            },
            relations: ['starring', 'starring.star'],
        });
        if (!movie) {
            throw new NotFoundException('Movie not found');
        }
        return movie;
    }
}
