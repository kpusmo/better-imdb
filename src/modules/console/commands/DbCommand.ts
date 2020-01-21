import {Command, Console} from 'nestjs-console';
import {UserSeeder} from '../../user/seeders/UserSeeder';
import {RoleSeeder} from '../../authorization/seeders/RoleSeeder';
import {MovieSeeder} from '../../movie/seeders/MovieSeeder';

@Console({
    name: 'db',
    description: 'A command to operate on database',
})
export class DbCommand {
    constructor(
        private readonly userSeeder: UserSeeder,
        private readonly roleSeeder: RoleSeeder,
        private readonly movieSeeder: MovieSeeder,
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
        await this.movieSeeder.seed(includeFake);
        process.exit(0);
    }
}
