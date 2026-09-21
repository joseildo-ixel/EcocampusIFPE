import { applyIsOptionalDecorator, applyValidateIfDefinedDecorator, inheritPropertyInitializers, inheritTransformationMetadata, inheritValidationMetadata, } from './type-helpers.utils.js';
export function PartialType(classRef, options = {}) {
    class PartialClassType {
        constructor() {
            inheritPropertyInitializers(this, classRef);
        }
    }
    const propertyKeys = inheritValidationMetadata(classRef, PartialClassType);
    inheritTransformationMetadata(classRef, PartialClassType);
    if (propertyKeys) {
        propertyKeys.forEach((key) => {
            options.skipNullProperties === false
                ? applyValidateIfDefinedDecorator(PartialClassType, key)
                : applyIsOptionalDecorator(PartialClassType, key);
        });
    }
    Object.defineProperty(PartialClassType, 'name', {
        value: `Partial${classRef.name}`,
    });
    return PartialClassType;
}
