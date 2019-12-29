import test from 'ava';
import {ApplicationEventService} from '../application-event.service';

test('should init', t => {
	const service = new ApplicationEventService();
	t.assert(service);
});

test('should be able to create a listener and return a stream', t => {
	const service = new ApplicationEventService();
	const stream = service.createListener('test', () => {});
	t.assert(stream);
});

test('should be able to create a listener and send an event through it', t => {
	const service = new ApplicationEventService();
	service.createListener('test', () => t.pass());
	service.sendEvent('test');
});
