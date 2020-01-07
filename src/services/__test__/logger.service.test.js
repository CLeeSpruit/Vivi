import test from 'ava';
import {LoggerService} from '../logger.service';
import {ModuleFactory} from '../../factory/module-factory';

test('should init', t => {
	const actual = new LoggerService(new ModuleFactory());
	t.assert(actual);
});
