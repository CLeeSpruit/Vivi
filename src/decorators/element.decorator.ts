import 'reflect-metadata';
const metadataKey = Symbol('ViviElement');

interface ViviElementParams {
    propertyKey?: string;
    selector: string;
    eventType?: string;
    handlerFnName?: string;
}

export function ViviElement(params: ViviElementParams): PropertyDecorator {
    return function (target: Object, propertyKey: string) {
        let props = Reflect.getMetadata(metadataKey, target);
        const objParams: ViviElementParams = { ...params, propertyKey };
        if (props) {
            props.push(objParams);
        } else {
            props = [objParams];
            Reflect.defineMetadata(metadataKey, props, target);
        }
    }
}

export function getElements(origin: Object): Array<ViviElementParams> {
    return Reflect.getMetadata(metadataKey, origin) || new Array<ViviElementParams>();
}