import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsNotInFuture(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isNotInFuture',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(currentValue: any, args: ValidationArguments) {
          const date = new Date(currentValue);
          return date <= new Date();
        },
      },
    });
  };
}
