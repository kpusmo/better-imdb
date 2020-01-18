import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from './models/User';
import {UserService} from './services/UserService';
import {UserController} from './controllers/UserController';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
    ],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService],
})
export class UserModule {
}
