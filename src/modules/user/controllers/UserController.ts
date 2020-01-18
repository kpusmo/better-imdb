import {Controller, Get, Req, UseGuards} from '@nestjs/common';
import {ModuleRef} from '@nestjs/core';
import {AuthGuard} from '@nestjs/passport';

@Controller('/users')
export class UserController {
    constructor(
        private readonly moduleRef: ModuleRef,
    ) {
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async getList(@Req() request) {
        return request.user;
    }
}
