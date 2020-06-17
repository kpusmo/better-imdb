import {Controller, Get, NotFoundException, Param, Query, UseGuards, UseInterceptors} from '@nestjs/common';
import {DatatableService} from '../../datatable/services/DatatableService';
import {GetMovieListTransferObject} from '../transfer-objects/GetMovieListTransferObject';
import {Movie} from '../models/Movie';
import {AuthGuard} from '@nestjs/passport';
import {GetMovieTransferObject} from '../transfer-objects/GetMovieTransferObject';
import {MovieService} from '../services/MovieService';
import {MovieTransformer} from '../interceptors/MovieTransformer';
import {MovieListTransformer} from '../interceptors/MovieListTransformer';
import {MovieListService} from '../services/MovieListService';

@Controller('movies')
export class MovieController {
    constructor(
        private readonly movieListService: MovieListService,
        private readonly movieService: MovieService,
    ) {
    }

    @Get()
    @UseInterceptors(MovieListTransformer)
    @UseGuards(AuthGuard('jwt'))
    async getList(@Query() dto: GetMovieListTransferObject) {
        return this.movieListService.getList(dto);
    }

    @Get(':movieId')
    @UseInterceptors(MovieTransformer)
    @UseGuards(AuthGuard('jwt'))
    async get(@Param() dto: GetMovieTransferObject) {
        return await this.movieService.findMovieById(dto.movieId);
    }
}
