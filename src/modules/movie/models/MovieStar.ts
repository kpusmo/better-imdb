import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Movie} from './Movie';
import {MovieStarAppearanceType} from '../enums/MovieStarAppearanceType';
import {Star} from './Star';

@Entity('movie_stars')
export class MovieStar {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    movieId: number;

    @Column()
    starId: number;

    @Column()
    type: MovieStarAppearanceType;

    @Column()
    role: string;

    @ManyToOne(type => Movie, movie => movie.starring)
    movie: Movie;

    @ManyToOne(type => Star, star => star.appearances)
    star: Star;
}
