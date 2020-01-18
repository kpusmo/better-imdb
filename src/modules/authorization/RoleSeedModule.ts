import {Module} from '@nestjs/common';
import {RoleSeeder} from './seeders/RoleSeeder';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Role} from './models/Role';

@Module({
    imports: [
        TypeOrmModule.forFeature([Role]),
    ],
    providers: [RoleSeeder],
    exports: [RoleSeeder, TypeOrmModule.forFeature()],
})
export class RoleSeedModule {
}
