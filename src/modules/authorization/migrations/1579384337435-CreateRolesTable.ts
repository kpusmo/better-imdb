import {MigrationInterface, QueryRunner} from 'typeorm';

export class CreateRolesTable1579384337435 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            create table roles
            (
                id   int unsigned auto_increment,
                name varchar(50) not null,
                constraint roles_pk
                    primary key (id)
            );
        `);
        await queryRunner.query(`
            create unique index roles_name_uindex
                on roles (name);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('DROP TABLE roles');
    }

}
