import test from 'ava';
import {Service} from '../service';

test('should init', t => {
	const actual = new Service();
	t.assert(actual);
});

test('should setData', t => {
	const actual = new Service();
	const fakeId = 'test';
	actual.setData(fakeId);
	t.is(actual.id, 'Service-' + fakeId);
});
