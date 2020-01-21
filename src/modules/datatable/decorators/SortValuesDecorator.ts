import {registerDecorator, ValidationArguments, ValidationOptions} from 'class-validator';

export function SortValuesIn(fieldNames: string[], validationOptions?: ValidationOptions) {
    // tslint:disable-next-line:only-arrow-functions
    return function(object, propertyName: string) {
        registerDecorator({
            name: 'sortValuesIn',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, validationArguments?: ValidationArguments): boolean {
                    const validSortValues = [];
                    for (const field of fieldNames) {
                        validSortValues.push(field + '|asc');
                        validSortValues.push(field + '|desc');
                    }
                    return validSortValues.indexOf(value) !== -1;
                },
            },
        });
    };
}
