import {TypeOrmModuleOptions, TypeOrmOptionsFactory} from '@nestjs/typeorm';
import {Injectable} from '@nestjs/common';
import {SnakeNamingStrategy} from 'typeorm-naming-strategies';
import {ConfigService} from '../modules/config/Services/ConfigService';

@Injectable()
export default class TestDatabaseConfigService implements TypeOrmOptionsFactory {
    constructor(private configService: ConfigService) {
    }

    createTypeOrmOptions(connectionName?: string): TypeOrmModuleOptions {
        return {
            type: 'mariadb' as 'mariadb',
            host: this.configService.getString('TYPEORM_TEST_HOST'),
            port: this.configService.getNumber('DOCKER_DATABASE_TEST_PORT'),
            username: this.configService.getString('TYPEORM_TEST_USERNAME'),
            password: this.configService.getString('TYPEORM_TEST_PASSWORD'),
            database: this.configService.getString('TYPEORM_TEST_DATABASE'),
            entities: this.configService.getArray('TYPEORM_TEST_ENTITIES', ','),
            migrations: this.configService.getArray('TYPEORM_TEST_MIGRATIONS', ','),
            namingStrategy: new SnakeNamingStrategy(),
            logging: false,
            synchronize: false,
            migrationsRun: false,
        };
    }
}
