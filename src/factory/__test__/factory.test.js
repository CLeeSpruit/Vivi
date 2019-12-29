import test from 'ava';

import {MockComponent} from '../../models/__mocks__/component.mock';
import {MockService} from '../../models/__mocks__/service.mock';
import {Factory} from '../factory';

test('should init', t => {
	const actual = new Factory(MockComponent);
	t.assert(actual);
});

test('should create a new instance and return that instance', t => {
	const mock = new Factory(MockComponent);
	const actual = mock.create();
	t.assert(actual);
	t.assert(actual instanceof MockComponent);
});

test('should create with prereqs', t => {
	const actual = new Factory(MockComponent, [MockService]);
	t.assert(actual.prerequisites.length);
});

test('get should return specific instance', t => {
	const factory = new Factory(MockComponent);
	const componentA = factory.create();
	const componentB = factory.create();
	t.is(factory.get(componentA.id), componentA);
	t.is(factory.get(componentB.id), componentB);
});

test('get should return latest component created if no id is provided', t => {
	const factory = new Factory(MockComponent);
	factory.create();
	const instanceB = factory.create();
	t.is(factory.get(), instanceB);
});

test('get should return null if no id is provided and no components have been created', t => {
	const factory = new Factory(MockComponent);
	t.is(factory.get(), null);
});

test('should remove from the factory map', t => {
	const factory = new Factory(MockComponent);
	const comp = factory.create();
	t.truthy(factory.get(comp.id));

	factory.destroy(comp.id);

	t.falsy(factory.get(comp.id));
});

// Error related. Refactor.
test.todo('destroy should throw error if instance does not exist');
