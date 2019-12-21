import test from 'ava';
import {GetElNameFromComponent} from '../get-el-name-from-component';

test('Should get a simple component name', t => {
    const actual = GetElNameFromComponent('MockComponent');

    t.assert(actual === 'mock');
});

test('should get complex component name', t => {
    const actual = GetElNameFromComponent('MyCoolComponent');

    t.assert(actual === 'my-cool');
});

test('should get multiword complex component name', t => {
    const actual = GetElNameFromComponent('MyReallyReallyCoolComponent');

    t.assert(actual === 'my-really-really-cool');
});