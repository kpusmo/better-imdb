import {MigrationInterface, QueryRunner} from 'typeorm';

export class CreateMovieStarsTable1579528257089 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            create table movie_stars
            (
                id       int unsigned auto_increment,
                movie_id int unsigned not null,
                star_id  int unsigned not null,
                constraint movie_stars_pk
                    primary key (id),
                constraint movie_stars_movies_id_fk
                    foreign key (movie_id) references movies (id),
                constraint movie_stars_stars_id_fk
                    foreign key (star_id) references stars (id)
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('DROP TABLE movie_stars');
    }
}
