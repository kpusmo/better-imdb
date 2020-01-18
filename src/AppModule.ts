import {Module} from '@nestjs/common';
import {ConfigModule} from './modules/config/ConfigModule';
import {TypeOrmModule} from '@nestjs/typeorm';
import DatabaseConfigService from './database/DatabaseConfigService';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useClass: DatabaseConfigService,
        }),
        ConfigModule,
    ],
})
export class AppModule {
}
