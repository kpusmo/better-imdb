import {Command, Console} from 'nestjs-console';
import {UserSeeder} from '../../user/seeders/UserSeeder';
import {RoleSeeder} from '../../authorization/seeders/RoleSeeder';

@Console({
    name: 'db',
    description: 'A command to operate on database',
})
export class DbCommand {
    constructor(
        private readonly userSeeder: UserSeeder,
        private readonly roleSeeder: RoleSeeder,
    ) {
    }

    @Command({
        command: 'seed',
        options: [
            {
                defaultValue: false,
                description: 'descr',
                flags: 'flags',
            },
        ],
        description: 'Seeds database with seeders provided by modules',
    })
    async seed(_, args) {
        const includeFake = args && args.indexOf('fake') !== -1;
        await this.roleSeeder.seed(includeFake);
        await this.userSeeder.seed(includeFake);
        process.exit(0);
    }
}
