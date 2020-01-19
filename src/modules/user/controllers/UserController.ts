import {Controller, Get, Req, UseGuards} from '@nestjs/common';
import {ModuleRef} from '@nestjs/core';
import {AuthGuard} from '@nestjs/passport';
import {RolesGuard} from '../../authorization/guards/RolesGuard';
import {Roles} from '../../authorization/decorators/RolesDecorator';

@Controller('/users')
export class UserController {
    constructor(
        private readonly moduleRef: ModuleRef,
    ) {
    }

    @Get()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN')
    async getList(@Req() request) {
        return request.user;
    }
}
