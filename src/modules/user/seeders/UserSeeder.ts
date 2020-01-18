import {Injectable} from '@nestjs/common';
import {Seeder} from '../../../abstracts/Seeder';
import {User} from '../models/User';
import {UserService} from '../services/UserService';
import * as faker from 'faker';
import {ConfigService} from '../../config/Services/ConfigService';
import * as crypto from 'crypto';

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
        const salt = this.configService.getString('APP_KEY');
        users = users.map(user => {
           user.password = crypto.createHmac('sha512', salt).update(user.password).digest('hex');
           return user;
        });
        await this.userService.save(users);
    }

}
