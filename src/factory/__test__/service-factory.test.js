import test from 'ava';
import {ServiceFactory} from '../service-factory';
import {MockService} from '../../models/__mocks__/service.mock';
import {ModuleFactory} from '../module-factory';

test('should init', t => {
	const actual = new ServiceFactory(MockService, new ModuleFactory());
	t.assert(actual);
});
