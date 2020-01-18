import {Module} from '@nestjs/common';
import {ConsoleModule as BaseConsoleModule} from 'nestjs-console';
import {TypeOrmModule} from '@nestjs/typeorm';
import DatabaseConfigService from '../../database/DatabaseConfigService';
import {UserSeederModule} from '../user/UserSeederModule';
import {DbCommand} from './commands/DbCommand';
import {ConfigModule} from '../config/ConfigModule';
import {RoleSeeder} from '../authorization/seeders/RoleSeeder';
import {RoleSeedModule} from '../authorization/RoleSeedModule';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useClass: DatabaseConfigService,
        }),
        UserSeederModule,
        RoleSeedModule,
        BaseConsoleModule,
        ConfigModule,
    ],
    providers: [
        DbCommand,
    ],
    exports: [
        DbCommand,
    ],
})
export class ConsoleModule {
}
