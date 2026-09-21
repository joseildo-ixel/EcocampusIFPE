import { inheritPropertyInitializers, inheritTransformationMetadata, inheritValidationMetadata, } from './type-helpers.utils.js';
export function IntersectionType(...classRefs) {
    class IntersectionClassType {
        constructor() {
            classRefs.forEach((classRef) => {
                inheritPropertyInitializers(this, classRef);
            });
        }
    }
    classRefs.forEach((classRef) => {
        inheritValidationMetadata(classRef, IntersectionClassType);
        inheritTransformationMetadata(classRef, IntersectionClassType, undefined, false);
    });
    const intersectedNames = classRefs.reduce((prev, ref) => prev + ref.name, '');
    Object.defineProperty(IntersectionClassType, 'name', {
        value: `Intersection${intersectedNames}`,
    });
    return IntersectionClassType;
}
