import {Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {Role} from '../../authorization/models/Role';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fullName: string;

    @Column()
    email: string;

    @Column({select: false})
    password: string;

    @CreateDateColumn({type: 'datetime'})
    dateCreated: Date;

    @UpdateDateColumn({type: 'datetime'})
    dateModified: Date;

    @ManyToMany(type => Role)
    @JoinTable({
        name: 'user_roles',
        joinColumn: {name: 'user_id'},
        inverseJoinColumn: {name: 'role_id'},
    })
    roles: Role[];
}
