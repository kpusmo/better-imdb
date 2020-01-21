import {MigrationInterface, QueryRunner} from 'typeorm';

export class AlterStarsTableAddPicturePathColumn1579621162782 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            alter table stars
                add picture_path varchar(255) not null after death_date;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`alter table stars drop column picture_path`);
    }
}
