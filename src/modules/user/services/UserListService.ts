import {Injectable} from '@nestjs/common';
import {DatatableService} from '../../datatable/services/DatatableService';
import {User} from '../models/User';
import {GetUserListTransferObject} from '../transfer-objects/GetUserListTransferObject';
import {DatatableResult} from '../../datatable/types/DatatableResult';

@Injectable()
export class UserListService {
    constructor(
        private readonly datatableService: DatatableService<User>,
    ) {
    }

    async getList(dto: GetUserListTransferObject): Promise<DatatableResult<User>> {
        dto.table = 'users';
        return await this.datatableService.get(dto);
    }
}
