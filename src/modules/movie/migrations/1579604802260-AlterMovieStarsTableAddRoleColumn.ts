import {MigrationInterface, QueryRunner} from 'typeorm';

export class AlterMovieStarsTableAddRoleColumn1579604802260 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            alter table movie_stars
                add role varchar(255) null;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('alter table movie_stars drop column role;');
    }
}
