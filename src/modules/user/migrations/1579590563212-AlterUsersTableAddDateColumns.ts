import {MigrationInterface, QueryRunner} from 'typeorm';

export class AlterUsersTableAddDateColumns1579590563212 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            alter table users
                add date_created datetime default NOW() not null;
        `);
        await queryRunner.query(`
            alter table users
                add date_modified datetime default NOW() not null;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('alter table users drop column date_created;');
        await queryRunner.query('alter table users drop column date_modified;');
    }

}
