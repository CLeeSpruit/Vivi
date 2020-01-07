import test from 'ava';
import {ComponentFactory} from '../component-factory';
import {MockComponent} from '../../models/__mocks__/component.mock';
import {ModuleFactory} from '../module-factory';

const vivi = new ModuleFactory();
test.afterEach(() => {
	vivi.clearAll();
});

test('should init', t => {
	const actual = new ComponentFactory(MockComponent, new ModuleFactory());
	t.assert(actual);
});

test('should create a new component and return that component', t => {
	const factory = vivi.createFactory(MockComponent);
	const actual = factory.create();
	t.assert(actual);
	t.assert(actual instanceof MockComponent);
});

test('should create component and set root in nodeTreeService', t => {
	const factory = vivi.createFactory(MockComponent);
	factory.createRoot();
	const actual = factory.get();
	t.assert(actual);
	t.assert(vivi.get('NodeTreeService').applicationTree);
});

// Error related. Refactor.
test.todo('detach should throw error and do nothing if the component does not exist');

test('should detach and return node tree', t => {
	const factory = vivi.createFactory(MockComponent);
	const comp = factory.create({parentEl: document.body});
	const actual = factory.detach(comp.id);
	t.assert(actual);
	t.falsy(actual.component.element.isConnected);
});

test('destroy should trigger component destroy', t => {
	const factory = vivi.createFactory(MockComponent);
	const comp = factory.create({parentEl: document.body});
	const actual = factory.destroy(comp.id);
	t.assert(actual);
	t.falsy(actual.component.element.isConnected);
});

test('destroy should remove from the DOM', t => {
	const factory = vivi.createFactory(MockComponent);
	const comp = factory.create({parentEl: document.body})
	factory.destroy(comp.id);

	const actual = document.querySelector(comp.id);
	t.falsy(actual);
});
