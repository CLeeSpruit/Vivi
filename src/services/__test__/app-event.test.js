import test from 'ava';
import {AppEvent} from '../app-event';

test('should init', t => {
	const service = new AppEvent();
	t.assert(service);
});

test('should be able to create a listener and return a stream', t => {
	const service = new AppEvent();
	const stream = service.createListener('test', () => {});
	t.assert(stream);
});

test('should be able to create a listener and send an event through it', t => {
	const service = new AppEvent();
	service.createListener('test', () => t.pass());
	service.sendEvent('test');
});
