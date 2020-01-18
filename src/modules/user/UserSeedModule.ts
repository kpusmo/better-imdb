import {Module} from '@nestjs/common';
import {UserSeeder} from './seeders/UserSeeder';
import {UserService} from './services/UserService';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from './models/User';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
    ],
    providers: [UserSeeder, UserService],
    exports: [UserSeeder],
})
export class UserSeedModule {
}
