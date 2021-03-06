import {DatatableTransferObject} from '../../datatable/transfer-objects/DatatableTransferObject';
import {SortValuesIn} from '../../datatable/decorators/SortValuesDecorator';

export class GetUserListTransferObject extends DatatableTransferObject {
    @SortValuesIn(['users.id', 'email', 'fullName'])
    sort: string;
}
