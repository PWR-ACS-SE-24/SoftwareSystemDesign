import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsLaterThan(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isLaterThan',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(currentValue: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];

          const date1 = new Date(currentValue);
          const date2 = new Date(relatedValue);

          return date1 > date2;
        },
      },
    });
  };
}
