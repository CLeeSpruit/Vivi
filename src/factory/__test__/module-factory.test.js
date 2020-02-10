import test from 'ava';
import {MockComponent, MockChildComponent} from '../../models/__mocks__/component.mock';
import {MockService} from '../../models/__mocks__/service.mock';
import {ModuleFactory} from '../module-factory';
import {ComponentFactory} from '../component-factory';
import {ServiceFactory} from '../service-factory';

const fullConstructor = () => {
	return new ModuleFactory({
		serviceConstructors: [MockService],
		componentConstructors: [MockChildComponent, MockComponent],
		rootComponent: MockComponent
	});
};

test('should init - empty', t => {
	const actual = new ModuleFactory();
	t.assert(actual);
});

test('should init - no components', t => {
	const actual = new ModuleFactory({serviceConstructors: [MockService]});
	t.assert(actual);
});

test('should init - no services', t => {
	const actual = new ModuleFactory({componentConstructors: [MockComponent], rootComponent: MockComponent});
	t.assert(actual);
});

test('should init - no root component', t => {
	const actual = new ModuleFactory({componentConstructors: [MockComponent], serviceConstructors: [MockService]});
	t.assert(actual);
});

test('should init - full', t => {
	const actual = fullConstructor();
	t.assert(actual);
});

test('should init - root component is created', t => {
	const vivi = new ModuleFactory({
		componentConstructors: [MockComponent],
		serviceConstructors: [MockService],
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

test('get should return component if created', t => {
	const vivi = fullConstructor();
	vivi.getFactory(MockComponent).createRoot(null, null, {isRoot: true});
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
	t.is(actual, ['MockChildComponent', 'MockComponent']);
});
