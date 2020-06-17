import {registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface} from 'class-validator';

@ValidatorConstraint({ name: 'sortValuesIn', async: false })
export class SortValuesInConstraint implements ValidatorConstraintInterface {
    public validate(value: string, validationArguments?: ValidationArguments): boolean {
        const fieldNames = validationArguments.constraints;
        const validSortValues = this.buildSortValues(fieldNames);
        return validSortValues.indexOf(value) !== -1;
    }

    public defaultMessage(validationArguments?: ValidationArguments): string {
        const fieldNames = validationArguments.constraints;
        const validSortValues = this.buildSortValues(fieldNames);
        return `$property value must be one of: ${validSortValues.join(', ')}`;
    }

    private buildSortValues(fieldNames: string[]): string[] {
        const validSortValues = [];
        for (const field of fieldNames) {
            validSortValues.push(field + '|asc');
            validSortValues.push(field + '|desc');
        }
        return validSortValues;
    }
}

export function SortValuesIn(fieldNames: string[], validationOptions?: ValidationOptions) {
    // tslint:disable-next-line:only-arrow-functions
    return function(object, propertyName: string) {
        registerDecorator({
            name: 'sortValuesIn',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: fieldNames,
            validator: SortValuesInConstraint,
        });
    };
}
