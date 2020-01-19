import {Body, Controller, HttpCode, Post, Put, Req, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {AuthenticationService} from '../services/AuthenticationService';
import {RefreshTokenTransferObject} from '../transferObjects/RefreshTokenTransferObject';

@Controller()
export class AuthenticationController {
    constructor(
        private readonly authenticationService: AuthenticationService,
    ) {
    }

    @Post('/login')
    @UseGuards(AuthGuard('local'))
    @HttpCode(200)
    async login(@Req() request) {
        return request.user;
    }

    @Put('/refresh-token')
    @UseGuards(AuthGuard('jwt'))
    async refreshToken(@Body() dto: RefreshTokenTransferObject, @Req() request) {
        return await this.authenticationService.refreshAccessToken(request.user, dto.token);
    }
}
