import { inheritPropertyInitializers, inheritTransformationMetadata, inheritValidationMetadata, } from './type-helpers.utils.js';
export function OmitType(classRef, keys) {
    const isInheritedPredicate = (propertyKey) => !keys.includes(propertyKey);
    class OmitClassType {
        constructor() {
            inheritPropertyInitializers(this, classRef, isInheritedPredicate);
        }
    }
    inheritValidationMetadata(classRef, OmitClassType, isInheritedPredicate);
    inheritTransformationMetadata(classRef, OmitClassType, isInheritedPredicate);
    return OmitClassType;
}
