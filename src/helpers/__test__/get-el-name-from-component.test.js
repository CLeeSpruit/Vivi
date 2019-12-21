import test from 'ava';
import {getElNameFromComponent} from '../get-el-name-from-component';

test('Should get a simple component name', t => {
	const actual = getElNameFromComponent('MockComponent');

	t.assert(actual === 'mock');
});

test('should get complex component name', t => {
	const actual = getElNameFromComponent('MyCoolComponent');

	t.assert(actual === 'my-cool');
});

test('should get multiword complex component name', t => {
	const actual = getElNameFromComponent('MyReallyReallyCoolComponent');

	t.assert(actual === 'my-really-really-cool');
});
