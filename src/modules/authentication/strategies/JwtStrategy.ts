import {Injectable} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {ConfigService} from '../../config/Services/ConfigService';
import AuthUser from '../types/AuthUser';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getString('JWT_SECRET'),
        });
    }

    validate(payload: any): AuthUser {
        return {
            userId: payload.userId,
            roles: payload.roles,
        };
    }
}
