import {MovieStarAppearanceType} from '../enums/MovieStarAppearanceType';

export const transformMovieDirector = movie => {
    const directorIndex = movie.starring.findIndex(movieStar => movieStar.type === MovieStarAppearanceType.director);
    if (directorIndex === -1) {
        return movie;
    }
    movie.director = movie.starring[directorIndex];
    movie.starring.splice(directorIndex, 1);
    return movie;
};
