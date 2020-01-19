import {IsNotEmpty} from 'class-validator';

export class RefreshTokenTransferObject {
    @IsNotEmpty()
    token: string;
}
