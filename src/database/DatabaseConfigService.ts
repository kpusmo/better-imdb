import {TypeOrmModuleOptions, TypeOrmOptionsFactory} from '@nestjs/typeorm';
import {Injectable} from '@nestjs/common';
import {SnakeNamingStrategy} from 'typeorm-naming-strategies';
import {ConfigService} from '../modules/config/Services/ConfigService';

@Injectable()
export default class DatabaseConfigService implements TypeOrmOptionsFactory {
    constructor(private configService: ConfigService) {
    }

    createTypeOrmOptions(connectionName?: string): TypeOrmModuleOptions {
        return {
            type: 'mariadb',
            host: this.configService.getString('TYPEORM_HOST'),
            port: this.configService.getNumber('TYPEORM_PORT'),
            username: this.configService.getString('TYPEORM_USERNAME'),
            password: this.configService.getString('TYPEORM_PASSWORD'),
            database: this.configService.getString('TYPEORM_DATABASE'),
            synchronize: this.configService.getBoolean('TYPEORM_SYNCHRONIZE'),
            logging: this.configService.getBoolean('TYPEORM_LOGGING'),
            migrationsRun: this.configService.getBoolean('TYPEORM_MIGRATIONS_RUN'),
            entities: this.configService.getArray('TYPEORM_ENTITIES', ','),
            migrations: this.configService.getArray('TYPEORM_MIGRATIONS', ','),
            namingStrategy: new SnakeNamingStrategy(),
        };
    }
}
