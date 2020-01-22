import {INestApplication} from '@nestjs/common';
import {Connection, Repository} from 'typeorm';
import {User} from '../../models/User';
import {AuthGuardFactory, createUser} from '../../../../helpers/testHelpers';
import {Test} from '@nestjs/testing';
import {getConnectionToken, getRepositoryToken, TypeOrmModule} from '@nestjs/typeorm';
import TestDatabaseConfigService from '../../../../database/TestDatabaseConfigService';
import {ConfigModule} from '../../../config/ConfigModule';
import {AuthGuard} from '@nestjs/passport';
import {UserModule} from '../../UserModule';
import {DatatableModule} from '../../../datatable/DatatableModule';
import * as request from 'supertest';
import {AuthenticationModule} from '../../../authentication/AuthenticationModule';
import {range} from '../../../../helpers/helpers';
import {Movie} from '../../../movie/models/Movie';

describe('UserController', () => {
    let app: INestApplication;
    let connection: Connection;
    let userRepository: Repository<User>;
    const authGuardFactory = new AuthGuardFactory();

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRootAsync({
                    useClass: TestDatabaseConfigService,
                }),
                TypeOrmModule.forFeature([Movie]),
                AuthenticationModule,
                ConfigModule,
                DatatableModule,
                UserModule,
            ],
        })
            .overrideGuard(AuthGuard('jwt'))
            .useValue(authGuardFactory.getGuard())
            .compile();
        app = module.createNestApplication();
        await app.init();

        connection = module.get(getConnectionToken());
        userRepository = module.get(getRepositoryToken(User));
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(async () => {
        authGuardFactory.setActivation(true);
        authGuardFactory.setFaking(true);
        await connection.runMigrations();
    });

    afterEach(async () => {
        // clear database after each test
        await connection.dropDatabase();
    });

    describe('getList', () => {
        it('throws unauthorized on not logged in user', async () => {
            authGuardFactory.setFaking(false);
            return request(app.getHttpServer())
                .get('/users')
                .expect(401)
                .expect({
                    statusCode: 401,
                    error: 'Unauthorized',
                });
        });

        it('throws forbidden on user not being admin', async () => {
            return request(app.getHttpServer())
                .get('/users')
                .expect(403)
                .expect({
                    statusCode: 403,
                    message: 'Forbidden resource',
                    error: 'Forbidden',
                });
        });

        it('returns paginated, sorted data', async () => {
            const users = await createUserStructure();
            authGuardFactory.setUser({
                userId: users[0].id,
                roles: [{
                    name: 'ADMIN',
                }],
            });
            const sortedUsers = users.sort((a, b) => b.id - a.id);
            return request(app.getHttpServer())
                .get('/users?perPage=2&page=3&sort=users.id|desc')
                .expect(200)
                .expect(async res => {
                    delete sortedUsers[4].password;
                    delete sortedUsers[5].password;
                    expect(res.body).toEqual({
                        perPage: '2',
                        page: '3',
                        total: 6,
                        data: [
                            JSON.parse(JSON.stringify(sortedUsers[4])),
                            JSON.parse(JSON.stringify(sortedUsers[5])),
                        ],
                    });
                });
        });

        it('returns all users when perPage is ALL', async () => {
            const users = await createUserStructure();
            authGuardFactory.setUser({
                userId: users[0].id,
                roles: [{
                    name: 'ADMIN',
                }],
            });
            return request(app.getHttpServer())
                .get('/users?perPage=ALL')
                .expect(200)
                .expect(async res => {
                    const mappedUsers = users.map(user => {
                        delete user.password;
                        return user;
                    });
                    expect(res.body).toEqual({
                        perPage: 'ALL',
                        total: 6,
                        data: JSON.parse(JSON.stringify(mappedUsers)),
                    });
                });
        });
    });

    const createUserStructure = async (): Promise<User[]> => {
        const users = [];
        users.push(await createUser(userRepository));
        for (const i of range(5)) {
            users.push(await createUser(userRepository));
        }
        return users;
    };
});
