import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {MovieStar} from './MovieStar';

@Entity('stars')
export class Star {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fullName: string;

    @Column({type: 'date'})
    birthDate: Date;

    @Column({type: 'date'})
    deathDate: Date;

    @Column()
    picturePath: string;

    @CreateDateColumn({type: 'datetime'})
    dateCreated: Date;

    @UpdateDateColumn({type: 'datetime'})
    dateModified: Date;

    @OneToMany(type => MovieStar, movieStar => movieStar.star)
    appearances: MovieStar;
}
