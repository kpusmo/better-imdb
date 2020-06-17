import {Controller, Get, Query, Req, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {RolesGuard} from '../../authorization/guards/RolesGuard';
import {Roles} from '../../authorization/decorators/Roles';
import {GetUserListTransferObject} from '../transfer-objects/GetUserListTransferObject';
import {UserListService} from '../services/UserListService';

@Controller('/users')
export class UserController {
    constructor(
        private readonly userListService: UserListService,
    ) {
    }

    @Get()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN')
    async getList(@Query() dto: GetUserListTransferObject, @Req() request) {
        return await this.userListService.getList(dto);
    }
}
