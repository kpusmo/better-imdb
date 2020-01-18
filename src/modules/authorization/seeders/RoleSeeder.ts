import {Injectable} from '@nestjs/common';
import {Seeder} from '../../../abstracts/Seeder';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Role} from '../models/Role';

@Injectable()
export class RoleSeeder extends Seeder {
    private readonly data = [
        {
            id: 1,
            name: 'USER',
        },
        {
            id: 2,
            name: 'ADMIN',
        },
    ];

    constructor(
        @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    ) {
        super();
    }

    async seed(includeFake: boolean): Promise<any> {
        await this.roleRepository.save(this.data);
    }
}
