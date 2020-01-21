import {Module} from '@nestjs/common';
import {ConsoleModule as BaseConsoleModule} from 'nestjs-console';
import {TypeOrmModule} from '@nestjs/typeorm';
import DatabaseConfigService from '../../database/DatabaseConfigService';
import {UserSeederModule} from '../user/UserSeederModule';
import {DbCommand} from './commands/DbCommand';
import {ConfigModule} from '../config/ConfigModule';
import {RoleSeedModule} from '../authorization/RoleSeedModule';
import {DatatableModule} from '../datatable/DatatableModule';
import {MovieSeederModule} from '../movie/MovieSeederModule';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useClass: DatabaseConfigService,
        }),
        UserSeederModule,
        RoleSeedModule,
        BaseConsoleModule,
        ConfigModule,
        DatatableModule,
        MovieSeederModule,
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
