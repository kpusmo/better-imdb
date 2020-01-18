import {BadRequestException} from '@nestjs/common';

export default class ValidationException extends BadRequestException {
    constructor(errors?: string | object | any) {
        super({
            errors,
            statusCode: 422,
            message: 'Validation Failed',
        });
    }

    getStatus(): number {
        return 422;
    }
}
