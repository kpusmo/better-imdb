import {IsNotEmpty, IsNumberString} from 'class-validator';

export class GetMovieTransferObject {
    @IsNotEmpty()
    @IsNumberString()
    movieId: number;
}
