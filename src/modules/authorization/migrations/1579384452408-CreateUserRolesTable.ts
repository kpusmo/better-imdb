import {MigrationInterface, QueryRunner} from 'typeorm';

export class CreateUserRolesTable1579384452408 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            create table user_roles
            (
                id      int unsigned auto_increment,
                role_id int unsigned not null,
                user_id int unsigned not null,
                constraint user_roles_pk
                    primary key (id),
                constraint user_roles_roles_id_fk
                    foreign key (role_id) references roles (id),
                constraint user_roles_users_id_fk
                    foreign key (user_id) references users (id)
            );
        `);
        await queryRunner.query(`
            create unique index user_roles_role_id_user_id_uindex
                on user_roles (role_id, user_id);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('DROP TABLE user_roles');
    }

}
