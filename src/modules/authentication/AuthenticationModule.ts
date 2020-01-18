import {JwtModule} from '@nestjs/jwt';
import {Global, Module} from '@nestjs/common';
import {UserModule} from '../user/UserModule';
import {JwtStrategy} from './strategies/JwtStrategy';
import {ConfigService} from '../config/Services/ConfigService';
import {AuthenticationService} from './services/AuthenticationService';
import {AuthenticationController} from './controllers/AuthenticationController';
import {PassportModule} from '@nestjs/passport';
import {LocalStrategy} from './strategies/LocalStrategy';
import {TypeOrmModule} from '@nestjs/typeorm';
import {RefreshToken} from './models/RefreshToken';

const configService = new ConfigService('.env');

@Global()
@Module({
    imports: [
        UserModule,
        JwtModule.register({
            secret: configService.getString('JWT_SECRET'),
            signOptions: {
                expiresIn: configService.getString('JWT_LIFESPAN'),
            },
        }),
        TypeOrmModule.forFeature([RefreshToken]),
        PassportModule,
    ],
    providers: [JwtStrategy, LocalStrategy, AuthenticationService],
    controllers: [AuthenticationController],
    exports: [AuthenticationService],
})
export class AuthenticationModule {
}
