const elementMetadataKey = 'ViviElement';

export function ViviElement(params) {
	return function (target, propertyKey) {
		let props = Reflect.get(target, elementMetadataKey);
		const objParams = {...params, propertyKey};
		if (props) {
			props.push(objParams);
		} else {
			props = [objParams];
			Reflect.defineProperty(target, elementMetadataKey, props);
		}
	};
}

export function getElements(origin) {
	return Reflect.get(origin, elementMetadataKey) || new Array();
}
