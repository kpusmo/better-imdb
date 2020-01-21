import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {MovieStar} from './MovieStar';

@Entity('movies')
export class Movie {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column({type: 'date'})
    premiereDate: Date;

    @Column()
    metascore: number;

    @Column()
    posterPath: string;

    @CreateDateColumn({type: 'datetime'})
    dateCreated: Date;

    @UpdateDateColumn({type: 'datetime'})
    dateModified: Date;

    @OneToMany(type => MovieStar, movieStar => movieStar.movie)
    starring: MovieStar[];
}
