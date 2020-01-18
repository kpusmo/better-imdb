import {MigrationInterface, QueryRunner} from 'typeorm';

export class CreateUsersTable1579364219658 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            create table users
            (
                id int unsigned auto_increment,
                full_name varchar(255) not null,
                email varchar(255) not null,
                password varchar(255) not null,
                constraint users_pk
                    primary key (id)
            );
        `);
        await queryRunner.query(`
            create unique index users_email_uindex
                on users (email);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('DROP TABLE users;');
    }
}
