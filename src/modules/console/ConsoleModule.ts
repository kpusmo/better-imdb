import {Module} from '@nestjs/common';
import {ConsoleModule as BaseConsoleModule} from 'nestjs-console';
import {TypeOrmModule} from '@nestjs/typeorm';
import DatabaseConfigService from '../../database/DatabaseConfigService';
import {UserSeedModule} from '../user/UserSeedModule';
import {DbCommand} from './commands/DbCommand';
import {ConfigModule} from '../config/ConfigModule';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useClass: DatabaseConfigService,
        }),
        UserSeedModule,
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
