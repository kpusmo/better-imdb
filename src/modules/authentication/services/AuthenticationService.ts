import {Injectable, UnauthorizedException} from '@nestjs/common';
import AuthUser from '../types/AuthUser';
import {JwtService} from '@nestjs/jwt';
import {ConfigService} from '../../config/Services/ConfigService';
import {createHmac, timingSafeEqual} from 'crypto';
import {UserService} from '../../user/services/UserService';
import {User} from '../../user/models/User';
import AuthResult from '../types/AuthResult';
import {RefreshToken} from '../models/RefreshToken';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {refreshTokenStatuses} from '../enums/RefreshTokenStatuses';
import {addMinutes, isBefore} from 'date-fns';

@Injectable()
export class AuthenticationService {
    constructor(
        private jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly userService: UserService,
        @InjectRepository(RefreshToken) private refreshTokenRepository: Repository<RefreshToken>,
    ) {
    }

    async login(email, password): Promise<AuthResult | undefined> {
        const user = await this.userService.findOne({
            where: {
                email,
            },
            relations: ['roles'],
        });
        if (!user || !this.checkUserCredentials(password, user)) {
            return;
        }
        const refreshToken = await this.createRefreshToken(user.id);
        return {
            expiresIn: this.configService.getNumber('JWT_LIFESPAN') * 60,
            accessToken: this.getAccessToken({
                userId: user.id,
                roles: user.roles,
            }),
            refreshToken: refreshToken.token,
        };
    }

    async refreshAccessToken(user: AuthUser, refreshToken: string): Promise<AuthResult> {
        const userRefreshToken = await this.getAndVerifyRefreshToken(user.userId, refreshToken);
        userRefreshToken.expirationDate = addMinutes(new Date(), this.configService.getNumber('JWT_REFRESH_TOKEN_LIFESPAN'));
        await this.refreshTokenRepository.save(userRefreshToken);
        return {
            expiresIn: this.configService.getNumber('JWT_LIFESPAN') * 60,
            accessToken: this.getAccessToken(user),
            refreshToken: userRefreshToken.token,
        };
    }

    hash(subject: string): string {
        const salt = this.configService.getString('APP_KEY');
        return createHmac('sha512', salt).update(subject).digest('hex');
    }

    checkUserCredentials(password: string, user: User): boolean {
        password = this.hash(password);
        return timingSafeEqual(Buffer.from(password), Buffer.from(user.password));
    }

    private async createRefreshToken(userId: number): Promise<RefreshToken> {
        await this.refreshTokenRepository.update({ownerId: userId}, {status: refreshTokenStatuses.inactive});
        const now = new Date();
        const token = this.hash('' + userId + now.getTime());
        const refreshToken = new RefreshToken();
        refreshToken.ownerId = userId;
        refreshToken.token = token;
        refreshToken.expirationDate = addMinutes(now, this.configService.getNumber('JWT_REFRESH_TOKEN_LIFESPAN'));
        return this.refreshTokenRepository.save(refreshToken);
    }

    private getAccessToken(user: AuthUser): string {
        return this.jwtService.sign(user);
    }

    private async getAndVerifyRefreshToken(userId: number, token: string): Promise<RefreshToken> {
        const refreshToken = await this.refreshTokenRepository.findOne({
            where: {
                ownerId: userId,
                status: refreshTokenStatuses.active,
                token,
            },
        });
        if (!refreshToken) {
            throw new UnauthorizedException();
        }
        if (isBefore(refreshToken.expirationDate, Date.now())) {
            throw new UnauthorizedException();
        }
        return refreshToken;
    }
}
