import {MigrationInterface, QueryRunner} from 'typeorm';

export class CreateRefreshTokenTable1579382010297 implements MigrationInterface {
    name = 'CreateRefreshTokenTable1579382010297';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            CREATE TABLE refresh_tokens (
              id int(10) unsigned NOT NULL AUTO_INCREMENT,
              owner_id int(10) unsigned NOT NULL,
              token text NOT NULL,
              status enum('active','inactive') NOT NULL DEFAULT 'active',
              number_of_refreshes int(11) NOT NULL DEFAULT 0,
              last_refresh_date datetime DEFAULT NULL,
              expiration_date datetime NOT NULL,
              date_created datetime NOT NULL DEFAULT NOW(),
              date_modified datetime NOT NULL DEFAULT NOW(),
              PRIMARY KEY (id),
              KEY refresh_tokens_owner_id_foreign (owner_id),
              CONSTRAINT refresh_tokens_owner_id_foreign FOREIGN KEY (owner_id) REFERENCES users (id)
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('DROP TABLE `refresh_tokens`');
    }

}
