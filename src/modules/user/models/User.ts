import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Role} from '../../authorization/models/Role';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fullName: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @ManyToMany(type => Role)
    @JoinTable({
        name: 'user_roles',
        joinColumn: {name: 'user_id'},
        inverseJoinColumn: {name: 'role_id'},
    })
    roles: Role[];

}
