import test from 'ava';
import {Mocker} from '../mocker';

test('should init', t => {
	t.assert(new Mocker());
});
