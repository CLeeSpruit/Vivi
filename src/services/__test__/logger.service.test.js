import test from 'ava';
import {LoggerService} from '../logger.service';
import {ModuleFactory} from '../../factory/module-factory';

const vivi = new ModuleFactory();
const service = vivi.get('LoggerService');
test('should init', t => {
	const actual = new LoggerService(vivi);
	t.assert(actual);
});

test('error should log errors', t => {
	service.error('test');
	t.pass();
});

test('warn should log warning', t => {
	service.warn('test');
	t.pass();
});

test('log should log information', t => {
	service.info('test');
	t.pass();
});

test('debug should log debug messages', t => {
	service.debug('test');
	t.pass();
});
