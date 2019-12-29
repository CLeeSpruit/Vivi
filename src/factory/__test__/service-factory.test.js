import test from 'ava';
import {ServiceFactory} from '../service-factory';
import {MockService} from '../../models/__mocks__/service.mock';

test('should init', t => {
	const actual = new ServiceFactory(MockService);
	t.assert(actual);
});
