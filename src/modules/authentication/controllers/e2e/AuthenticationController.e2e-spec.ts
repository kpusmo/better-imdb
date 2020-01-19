import {Test} from '@nestjs/testing';
import {AuthenticationModule} from '../../AuthenticationModule';
import {getConnectionToken, getRepositoryToken, TypeOrmModule} from '@nestjs/typeorm';
import TestDatabaseConfigService from '../../../../database/TestDatabaseConfigService';
import {Connection, Repository} from 'typeorm';
import {User} from '../../../user/models/User';
import {RefreshToken} from '../../models/RefreshToken';
import {INestApplication} from '@nestjs/common';
import {AuthenticationService} from '../../services/AuthenticationService';
import * as request from 'supertest';
import {ConfigService} from '../../../config/Services/ConfigService';
import {JwtService} from '@nestjs/jwt';
import {ConfigModule} from '../../../config/ConfigModule';
import AuthResult from '../../types/AuthResult';
import {AuthGuardFactory, createUser} from '../../../../helpers/TestHelpers';
import {AuthGuard} from '@nestjs/passport';
import {addMinutes, isBefore, subDays} from 'date-fns';
import {DatatableModule} from '../../../datatable/DatatableModule';

describe('AuthenticationController', () => {
    let app: INestApplication;
    let connection: Connection;
    let userRepository: Repository<User>;
    let refreshTokenRepository: Repository<RefreshToken>;
    let authenticationService: AuthenticationService;
    let configService: ConfigService;
    const authGuardFactory = new AuthGuardFactory();

    const testToken = 'TEST-TOKEN';
    const jwtService = {
        sign: payload => testToken,
    };

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRootAsync({
                    useClass: TestDatabaseConfigService,
                }),
                AuthenticationModule,
                DatatableModule,
                ConfigModule,
            ],
        })
            .overrideProvider(JwtService)
            .useValue(jwtService)
            .overrideGuard(AuthGuard('jwt'))
            .useValue(authGuardFactory.getGuard())
            .compile();
        app = module.createNestApplication();
        await app.init();

        connection = module.get(getConnectionToken());
        userRepository = module.get(getRepositoryToken(User));
        refreshTokenRepository = module.get(getRepositoryToken(RefreshToken));
        authenticationService = module.get(AuthenticationService);
        configService = module.get(ConfigService);

        authGuardFactory.setFaking(false);
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(async () => {
        await connection.runMigrations();
    });

    afterEach(async () => {
        // clear database after each test
        await connection.dropDatabase();
        authGuardFactory.setFaking(false);
    });

    describe('login', () => {
        it('logs in valid user', async () => {
            const user = await createUser(userRepository, {password: 'test'}, pass => authenticationService.hash(pass));
            return request(app.getHttpServer())
                .post('/login')
                .send({
                    email: user.email,
                    password: 'test',
                })
                .expect(200)
                .expect(async res => {
                    const refreshToken = await refreshTokenRepository.findOne({where: {ownerId: user.id}});
                    expect(refreshToken).toBeDefined();
                    expect(res.body).toStrictEqual({
                        accessToken: testToken,
                        refreshToken: refreshToken.token,
                        expiresIn: configService.getNumber('JWT_LIFESPAN') * 60,
                    });
                });
        });

        it('throws unauthorized on invalid user', async () => {
            const user = await createUser(userRepository, {password: 'test'}, pass => authenticationService.hash(pass));
            return request(app.getHttpServer())
                .post('/login')
                .send({
                    email: user.email,
                    password: 'wrong-password',
                })
                .expect(401)
                .expect({
                    statusCode: 401,
                    error: 'Unauthorized',
                });
        });
    });

    describe('refreshToken', () => {
        it('refreshes valid token', async () => {
            const refreshTokenLifespan = 10;
            const jwtLifespan = 15;

            const configServiceMock = jest.spyOn(configService, 'getNumber').mockImplementation(key => {
                if (key === 'JWT_REFRESH_TOKEN_LIFESPAN') {
                    return refreshTokenLifespan;
                } else if (key === 'JWT_LIFESPAN') {
                    return jwtLifespan;
                }
                return Math.floor(Math.random() * 1000);
            });

            const {user, authResult} = await createAndLogUserIn();

            const refreshToken = await refreshTokenRepository.findOne({where: {ownerId: user.id}});
            const initialExpirationDate = addMinutes(new Date(), refreshTokenLifespan - 5);
            refreshToken.expirationDate = initialExpirationDate;
            await refreshTokenRepository.save(refreshToken);
            fakeAuth({
                userId: user.id,
            });

            return request(app.getHttpServer())
                .put('/refresh-token')
                .send({
                    token: refreshToken.token,
                })
                .expect(200)
                .expect(async res => {
                    configServiceMock.mockClear();

                    const refreshTokens = await refreshTokenRepository.find({where: {ownerId: user.id}});
                    expect(refreshTokens.length).toBe(1);
                    expect(refreshTokens[0].token).toBe(authResult.refreshToken);
                    expect(isBefore(initialExpirationDate, refreshTokens[0].expirationDate)).toBe(true);
                    expect(res.body).toStrictEqual({
                        accessToken: testToken,
                        refreshToken: refreshTokens[0].token,
                        expiresIn: jwtLifespan * 60,
                    });
                });
        });

        it('throws unauthorized on expired token', async () => {
            const {user, authResult} = await createAndLogUserIn();

            const refreshToken = await refreshTokenRepository.findOne({where: {ownerId: user.id}});
            refreshToken.expirationDate = subDays(new Date(), 10);
            await refreshTokenRepository.save(refreshToken);
            fakeAuth({
                userId: user.id,
            });

            return request(app.getHttpServer())
                .put('/refresh-token')
                .send({
                    token: authResult.refreshToken,
                })
                .expect(401);
        });

        it('throws unauthorized on wrong token', async () => {
            const {user} = await createAndLogUserIn();
            fakeAuth({
                userId: user.id,
            });

            return request(app.getHttpServer())
                .put('/refresh-token')
                .send({
                    token: 'wrong-token',
                })
                .expect(401);
        });

        it('throws unauthorized on not owned token', async () => {
            const {user, authResult} = await createAndLogUserIn();
            fakeAuth({
                userId: user.id + 15, // not owner of token
            });

            authGuardFactory.setFaking(true);
            authGuardFactory.setActivation(true);
            authGuardFactory.setUser({
                userId: user.id + 15, // not owner of token
            });

            return request(app.getHttpServer())
                .put('/refresh-token')
                .send({
                    token: authResult.refreshToken,
                })
                .expect(401);
        });
    });

    const createAndLogUserIn = async () => {
        const password = 'test';
        const user = await createUser(userRepository, {password}, pass => authenticationService.hash(pass));
        // login to create refreshToken
        const authResult: AuthResult = await authenticationService.login(user.email, password);
        return {user, authResult};
    };

    const fakeAuth = (user) => {
        authGuardFactory.setFaking(true);
        authGuardFactory.setActivation(true);
        authGuardFactory.setUser(user);
    };
});
