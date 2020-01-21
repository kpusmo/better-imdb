import {MigrationInterface, QueryRunner} from 'typeorm';

export class CreateStarsTable1579527662310 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            create table stars
            (
                id            int unsigned auto_increment,
                full_name     varchar(255)           not null,
                birth_date    date                   not null,
                death_date    date                   null,
                date_created  datetime default NOW() not null,
                date_modified datetime default NOW() not null,
                constraint stars_pk
                    primary key (id)
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('DROP TABLE stars');
    }
}
