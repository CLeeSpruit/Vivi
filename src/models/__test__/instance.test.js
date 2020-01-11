import test from 'ava';
import {Instance} from '../instance';
import {ModuleFactory} from '../../factory/module-factory';

const vivi = new ModuleFactory();

test('should init', t => {
	const instance = new Instance(vivi);

	t.assert(instance);
});

test('should set data with no data', t => {
	const instance = new Instance(vivi);
	instance.setData(1);

	t.is(instance.id, 'Instance-1');
});

test('should set data with data', t => {
	const instance = new Instance(vivi);
	const testData = {test: 'hello'};
	instance.setData(1, testData);

	t.deepEqual(instance.data, testData);
});
