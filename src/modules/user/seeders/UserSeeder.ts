import {Injectable} from '@nestjs/common';
import {Seeder} from '../../../abstracts/Seeder';
import {User} from '../models/User';
import {UserService} from '../services/UserService';
import * as faker from 'faker';
import {ConfigService} from '../../config/Services/ConfigService';
import {AuthenticationService} from '../../authentication/services/AuthenticationService';
import {Role} from '../../authorization/models/Role';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {range} from '../../../helpers/helpers';

@Injectable()
export class UserSeeder extends Seeder {
    private readonly data: Array<Partial<User>> = [
        {
            id: 1,
            fullName: 'Admin Admin',
            email: 'admin@admin.com',
            password: 'admin',
            roles: [
                {
                    name: 'ADMIN',
                } as Role,
            ],
        },
    ];

    constructor(
        private readonly userService: UserService,
        private readonly configService: ConfigService,
        private readonly authenticationService: AuthenticationService,
        @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    ) {
        super();
    }

    async seed(includeFake: boolean): Promise<any> {
        let users = this.data;
        if (includeFake) {
            users = users.concat(UserSeeder.fakeUsers);
        }
        users = await this.mapUsers(users);
        await this.userService.save(users);
    }

    private async mapUsers(users: Array<Partial<User>>) {
        const roles = await this.roleRepository.find();
        return users.map(user => {
            // hash password
            user.password = this.authenticationService.hash(user.password);

            // all users must have USER role
            if (!user.roles) {
                user.roles = [];
            }
            user.roles.push({
                name: 'USER',
            } as Role);

            // replace role objects with Role entities matching by name
            user.roles = user.roles.map(role => roles.find(it => it.name === role.name));
            return user;
        });
    }

    private static get fakeUsers() {
        const users = [];
        for (const i of range(5)) {
            users.push({
                email: faker.internet.email(),
                fullName: faker.name.findName(),
                password: 'test',
            });
        }
        return users;
    }
}
