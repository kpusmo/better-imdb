import {DatatableTransferObject} from '../../datatable/transfer-objects/DatatableTransferObject';
import {SortValuesIn} from '../../datatable/decorators/SortValuesDecorator';

export class GetMovieListTransferObject extends DatatableTransferObject {
    @SortValuesIn(['title', 'premiere_date', 'metascore'])
    sort: string;
}
