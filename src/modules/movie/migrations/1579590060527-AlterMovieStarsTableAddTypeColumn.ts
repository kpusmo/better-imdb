import {MigrationInterface, QueryRunner} from 'typeorm';

export class AlterMovieStarsTableAddTypeColumn1579590060527 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            alter table movie_stars
                add type enum ('actor', 'director') null;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('alter table movies drop column type;');
    }
}
