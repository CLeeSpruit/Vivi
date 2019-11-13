import 'reflect-metadata';
const elementMetadataKey = 'ViviElement';

export interface ViviElementParams {
    propertyKey?: string;
    selector: string;
    eventType?: string;
    handlerFnName?: string;
}

export function ViviElement(params: ViviElementParams): PropertyDecorator {
    return function (target: Object, propertyKey: string) {
        let props = Reflect.getMetadata(elementMetadataKey, target);
        const objParams: ViviElementParams = { ...params, propertyKey };
        if (props) {
            props.push(objParams);
        } else {
            props = [objParams];
            Reflect.defineMetadata(elementMetadataKey, props, target);
        }
    }
}

export function getElements(origin: Object): Array<ViviElementParams> {
    return Reflect.getMetadata(elementMetadataKey, origin) || new Array<ViviElementParams>();
}