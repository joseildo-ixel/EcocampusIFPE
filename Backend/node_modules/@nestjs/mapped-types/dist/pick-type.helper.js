import { inheritPropertyInitializers, inheritTransformationMetadata, inheritValidationMetadata, } from './type-helpers.utils.js';
export function PickType(classRef, keys) {
    const isInheritedPredicate = (propertyKey) => keys.includes(propertyKey);
    class PickClassType {
        constructor() {
            inheritPropertyInitializers(this, classRef, isInheritedPredicate);
        }
    }
    inheritValidationMetadata(classRef, PickClassType, isInheritedPredicate);
    inheritTransformationMetadata(classRef, PickClassType, isInheritedPredicate);
    return PickClassType;
}
