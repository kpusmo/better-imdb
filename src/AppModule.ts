import {Module} from '@nestjs/common';
import {ConfigModule} from './modules/config/ConfigModule';
import {TypeOrmModule} from '@nestjs/typeorm';
import DatabaseConfigService from './database/DatabaseConfigService';
import {UserModule} from './modules/user/UserModule';
import {AuthenticationModule} from './modules/authentication/AuthenticationModule';
import {DatatableModule} from './modules/datatable/DatatableModule';
import {MovieModule} from './modules/movie/MovieModule';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useClass: DatabaseConfigService,
        }),
        DatatableModule,
        ConfigModule,
        AuthenticationModule,
        UserModule,
        MovieModule,
    ],
})
export class AppModule {
}
