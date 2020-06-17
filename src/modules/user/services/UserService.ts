import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from '../models/User';
import {Repository} from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) {
    }

    getLoginDataByEmail(email: string): Promise<User> {
        return this.userRepository.findOne({
            where: {
                email,
            },
            select: ['id', 'email', 'password'],
            relations: ['roles'],
        });
    }
}
