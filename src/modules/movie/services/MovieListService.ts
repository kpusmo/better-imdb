import {Injectable} from '@nestjs/common';
import {DatatableService} from '../../datatable/services/DatatableService';
import {Movie} from '../models/Movie';
import {GetMovieListTransferObject} from '../transfer-objects/GetMovieListTransferObject';

@Injectable()
export class MovieListService {
    constructor(
        private readonly datatableService: DatatableService<Movie>,
    ) {
    }

    async getList(dto: GetMovieListTransferObject) {
        dto.table = 'movies';
        dto.relations = ['movies.starring', 'starring.star'];
        return await this.datatableService.get(dto);
    }
}
