import {Injectable, UnauthorizedException} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {AuthenticationService} from '../services/AuthenticationService';
import {Strategy} from 'passport-local';
import AuthResult from '../types/AuthResult';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authenticationService: AuthenticationService,
    ) {
        super({
            usernameField: 'email',
        });
    }

    async validate(email: string, password: string): Promise<AuthResult> {
        const result = await this.authenticationService.login(email, password);
        if (!result) {
            throw new UnauthorizedException();
        }
        return result;
    }
}
