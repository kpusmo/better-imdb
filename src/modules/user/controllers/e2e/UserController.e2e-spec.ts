import {INestApplication} from '@nestjs/common';
import {Connection, Repository} from 'typeorm';
import {User} from '../../models/User';
import {AuthGuardFactory, createUser} from '../../../../helpers/TestHelpers';
import {Test} from '@nestjs/testing';
import {getConnectionToken, getRepositoryToken, TypeOrmModule} from '@nestjs/typeorm';
import TestDatabaseConfigService from '../../../../database/TestDatabaseConfigService';
import {ConfigModule} from '../../../config/ConfigModule';
import {AuthGuard} from '@nestjs/passport';
import {UserModule} from '../../UserModule';
import {DatatableModule} from '../../../datatable/DatatableModule';
import * as request from 'supertest';
import {Role} from '../../../authorization/models/Role';
import {AuthenticationModule} from '../../../authentication/AuthenticationModule';

describe('UserController', () => {
    let app: INestApplication;
    let connection: Connection;
    let userRepository: Repository<User>;
    let roleRepository: Repository<Role>;
    const authGuardFactory = new AuthGuardFactory();

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRootAsync({
                    useClass: TestDatabaseConfigService,
                }),
                TypeOrmModule.forFeature([Role]),
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
        roleRepository = module.get(getRepositoryToken(Role));

        authGuardFactory.setActivation(true);
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
    });

    describe('getList', () => {
        it('throws unauthorized on user not being admin', async () => {
            await createUser(userRepository);
            return request(app.getHttpServer())
                .get('/users')
                .expect(403)
                .expect({
                    statusCode: 403,
                    message: 'Forbidden resource',
                    error: 'Forbidden',
                });
        });

        it('returns paginated, sorted data with relations', async () => {
            const users = [];
            users.push(await createUser(userRepository));
            authGuardFactory.setUser({
                userId: users[0].id,
                roles: [{
                    name: 'ADMIN',
                }],
            });
            for (const i of Array(5).keys()) {
                users.push(await createUser(userRepository));
            }
            const sortedUsers = users.sort((a, b) => b.id - a.id);
            // todo relations
            return request(app.getHttpServer())
                .get('/users?perPage=2&page=3&sort=id|desc')
                .expect(200)
                .expect(res => {
                    expect(res.body.perPage).toBe('2');
                    expect(res.body.page).toBe('3');
                    expect(res.body.total).toBe(6);
                    expect(res.body.data).toEqual([
                        sortedUsers[4],
                        sortedUsers[5],
                    ]);
                });
        });
    });
});
