import {MigrationInterface, QueryRunner} from 'typeorm';

export class AlterMoviesTableAddPosterPathColumn1579620947202 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            alter table movies
                add poster_path varchar(255) not null after metascore;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`alter table movies drop column poster_path`);
    }
}
