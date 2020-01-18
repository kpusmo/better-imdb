import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from '../models/User';
import {FindManyOptions, Repository} from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) {
    }

    find(options: FindManyOptions<User>): Promise<User[]> {
        return this.userRepository.find(options);
    }

    save(entities): Promise<User[]> {
        return this.userRepository.save(entities);
    }
}
