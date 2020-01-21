import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Movie} from '../models/Movie';
import {MovieResponse} from '../types/MovieResponse';
import {transformMovieDirector} from './transformMovieDirector';

@Injectable()
export class MovieTransformer<T extends Movie> implements NestInterceptor<T, MovieResponse> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<MovieResponse> {
        return next.handle().pipe(map(transformMovieDirector));
    }
}
