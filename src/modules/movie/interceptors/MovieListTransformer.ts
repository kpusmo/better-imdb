import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Movie} from '../models/Movie';
import {DatatableResult} from '../../datatable/types/DatatableResult';
import {MovieResponse} from '../types/MovieResponse';
import {transformMovieDirector} from './transformMovieDirector';

interface MovieListResponse extends DatatableResult<Movie> {
    data: MovieResponse[];
}

@Injectable()
export class MovieListTransformer<T extends Movie> implements NestInterceptor<T, MovieListResponse> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<MovieListResponse> {
        return next.handle().pipe(map(response => {
            response.data = response.data.map(transformMovieDirector);
            return response;
        }));
    }
}
