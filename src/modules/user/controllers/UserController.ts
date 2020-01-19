import {Controller, Get, Query, Req, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {RolesGuard} from '../../authorization/guards/RolesGuard';
import {Roles} from '../../authorization/decorators/RolesDecorator';
import {DatatableService} from '../../datatable/services/DatatableService';
import {User} from '../models/User';
import {GetUserListTransferObject} from '../transfer-objects/GetUserListTransferObject';

@Controller('/users')
export class UserController {
    constructor(
        private readonly datatableService: DatatableService<User>,
    ) {
    }

    @Get()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN')
    async getList(@Query() dto: GetUserListTransferObject, @Req() request) {
        dto.table = 'users';
        return await this.datatableService.get(dto);
    }
}
