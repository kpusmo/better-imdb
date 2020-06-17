import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from './models/User';
import {UserService} from './services/UserService';
import {UserController} from './controllers/UserController';
import {UserListService} from './services/UserListService';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
    ],
    providers: [UserService, UserListService],
    controllers: [UserController],
    exports: [UserService],
})
export class UserModule {
}
