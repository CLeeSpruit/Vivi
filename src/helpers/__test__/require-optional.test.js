import test from 'ava';
import {RequireOptional} from '../require-optional';

test('should act like a require function if valid', t => {
	const actual = RequireOptional('path');
	t.assert(actual);
});

test('should return null if require is not found', t => {
	const actual = RequireOptional('some-non-existant-file.js');
	t.assert(actual === null);
});

test('shoud throw an error if it is something other than the module not being found', t => {
	// Blank require throws error
	t.throws(() => RequireOptional(''));
});
