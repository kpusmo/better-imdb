import {Module} from '@nestjs/common';
import {UserSeeder} from './seeders/UserSeeder';
import {UserService} from './services/UserService';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from './models/User';
import {AuthenticationModule} from '../authentication/AuthenticationModule';
import {RoleSeedModule} from '../authorization/RoleSeedModule';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        AuthenticationModule,
        RoleSeedModule,
    ],
    providers: [UserSeeder, UserService],
    exports: [UserSeeder],
})
export class UserSeederModule {
}
