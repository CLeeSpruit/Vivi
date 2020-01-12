import test from 'ava';
import {Factory} from '../factory';
import {ModuleFactory} from '../module-factory';
import {MockInstance} from '../../models/__mocks__/instance.mock';

const vivi = new ModuleFactory();
const factory = vivi.createFactory(MockInstance);

test('should init', t => {
	const actual = new Factory(MockInstance, new ModuleFactory());
	t.assert(actual);
});

test('should create a new instance and return that instance', t => {
	const actual = factory.create();
	t.assert(actual);
	t.assert(actual instanceof MockInstance);
});

test('get should return specific instance', t => {
	const componentA = factory.create();
	const componentB = factory.create();
	t.is(factory.get(componentA.id), componentA);
	t.is(factory.get(componentB.id), componentB);
});

test('get should return latest component created if no id is provided', t => {
	factory.create();
	const instanceB = factory.create();
	t.is(factory.get(), instanceB);
});

test('get should return null if no id is provided and no components have been created', t => {
	factory.destroyAll();
	t.is(factory.get(), null);
});

test('should remove from the factory map', t => {
	const comp = factory.create();
	t.truthy(factory.get(comp.id));

	factory.destroy(comp.id);

	t.falsy(factory.get(comp.id));
});
