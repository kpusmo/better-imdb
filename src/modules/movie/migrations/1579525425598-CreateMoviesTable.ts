import {MigrationInterface, QueryRunner} from 'typeorm';

export class CreateMoviesTable1579525425598 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            create table movies
            (
                id            int unsigned auto_increment,
                name          varchar(255)           not null,
                description   text                   not null,
                premiere_date date                   not null,
                date_created  datetime default NOW() not null,
                date_modified datetime default NOW() not null,
                constraint movies_pk
                    primary key (id)
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('DROP TABLE movies');
    }
}
