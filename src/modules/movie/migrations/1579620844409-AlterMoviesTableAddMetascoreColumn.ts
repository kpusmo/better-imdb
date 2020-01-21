import {MigrationInterface, QueryRunner} from 'typeorm';

export class AlterMoviesTableAddMetascoreColumn1579620844409 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            alter table movies
                add metascore decimal(10, 2) not null after premiere_date;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`alter table movies drop column metascore`);
    }
}
