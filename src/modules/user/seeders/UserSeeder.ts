import {Injectable} from '@nestjs/common';
import {Seeder} from '../../../abstracts/Seeder';
import {User} from '../models/User';
import {UserService} from '../services/UserService';
import * as faker from 'faker';
import {ConfigService} from '../../config/Services/ConfigService';
import {createHmac} from 'crypto';
import {AuthenticationService} from '../../authentication/services/AuthenticationService';

@Injectable()
export class UserSeeder extends Seeder {
    private readonly data: Array<Partial<User>> = [
        {
            id: 1,
            fullName: 'Admin Admin',
            email: 'admin@admin.com',
            password: 'admin',
        },
    ];

    constructor(
        private readonly userService: UserService,
        private readonly configService: ConfigService,
        private readonly authenticationService: AuthenticationService,
    ) {
        super();
    }

    async seed(includeFake: boolean): Promise<any> {
        let users = this.data;
        if (includeFake) {
            for (const i of Array(50).keys()) {
                users.push({
                    email: faker.internet.email(),
                    fullName: faker.name.findName(),
                    password: 'test',
                });
            }
        }
        users = users.map(user => {
           user.password = this.authenticationService.hash(user.password);
           return user;
        });
        await this.userService.save(users);
    }

}
