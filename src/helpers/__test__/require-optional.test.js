import test from 'ava';
import {requireOptional} from '../require-optional';

test('should act like a require function if valid', t => {
	const actual = requireOptional('path');
	t.assert(actual);
});

test('should return null if require is not found', t => {
	const actual = requireOptional('some-non-existant-file.js');
	t.assert(actual === null);
});

test('shoud throw an error if it is something other than the module not being found', t => {
	// Blank require throws error
	t.throws(() => requireOptional(''));
});
