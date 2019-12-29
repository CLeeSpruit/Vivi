import test from 'ava';
import {MockComponent, MockChildComponent} from '../../models/__mocks__/component.mock';
import {MockService, MockWithPrereqService} from '../../models/__mocks__/service.mock';
import {ModuleFactory} from '../module-factory';
import {ComponentFactory} from '../component-factory';
import {ServiceFactory} from '../service-factory';

const minimumConstructor = () => {
	return new ModuleFactory({
		componentConstructors: [{constructor: MockComponent}],
		rootComponent: MockComponent
	});
};

const fullConstructor = () => {
	return new ModuleFactory({
		serviceConstructors: [
			{constructor: MockService},
			{constructor: MockWithPrereqService, prereqArr: [MockService]}
		],
		componentConstructors: [
			{constructor: MockChildComponent},
			{constructor: MockComponent, services: [MockService]}
		],
		rootComponent: MockComponent
	});
};

test('should init - minimum', t => {
	const actual = minimumConstructor();
	t.assert(actual);
});

test('should init - full', t => {
	const actual = fullConstructor();
	t.assert(actual);
});

test('should init - root component is created', t => {
	const vivi = new ModuleFactory({
		componentConstructors: [{constructor: MockComponent, services: [MockService]}],
		serviceConstructors: [{constructor: MockService}],
		rootComponent: MockComponent
	});

	t.assert(vivi);
	t.assert(vivi.get(MockComponent));
});

test('getFactory should return componentFactory', t => {
	const vivi = fullConstructor();
	const actual = vivi.getFactory(MockComponent);
	t.assert(actual instanceof ComponentFactory);
});

test('getFactory should return serviceFactory', t => {
	const vivi = fullConstructor();
	const actual = vivi.getFactory(MockService);
	t.assert(actual instanceof ServiceFactory);
});

test('getFactory should return componentFactory by string', t => {
	const vivi = fullConstructor();
	const actual = vivi.getFactoryByString('MockComponent');
	t.assert(actual instanceof ComponentFactory);
});

test('getFactory should return serviceFactory by string', t => {
	const vivi = fullConstructor();
	const actual = vivi.getFactoryByString('MockService');
	t.assert(actual instanceof ServiceFactory);
});

// Error related
test.todo('getFactoryByString should throw error if no service or component is found');

test('get should return component if created', t => {
	const vivi = fullConstructor();
	vivi.getFactory(MockComponent).create(null, null, {isRoot: true});
	const actual = vivi.get(MockComponent);
	t.assert(actual instanceof MockComponent);
});

test('get should return service if created', t => {
	const vivi = fullConstructor();
	vivi.getFactory(MockService).create();
	const actual = vivi.get(MockService);
	t.assert(actual instanceof MockService);
});

test('getComponentRegistry should return array of component names in the module', t => {
	const vivi = fullConstructor();
	const actual = vivi.getComponentRegistry();
	t.deepEqual(actual, ['MockChildComponent', 'MockComponent']);
});
