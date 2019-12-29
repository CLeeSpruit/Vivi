import test from 'ava';
import {FactoryService} from '../factory.service';
import {Mocker} from '../../meta/mocker';
import {MockComponent} from '../../models/__mocks__/component.mock';
import {ApplicationEventService} from '../application-event.service';

test('should init', t => {
	const actual = new FactoryService();
	t.assert(actual);
});

const mock = new Mocker();
const service = mock.module.get(FactoryService);

test('getFactory should be able to return factory of a component', t => {
	const component = service.getFactory(MockComponent);
	t.assert(component);
});

test('getFactory should be able to return factory of a service', t => {
	const appService = service.getFactory(ApplicationEventService);
	t.assert(appService);
});

test('getFactoryByString should be able to return factory of a component', t => {
	const component = service.getFactoryByString('MockComponent');
	t.assert(component);
});

test('getFactoryByString should be able to return factory of a service', t => {
	const appService = service.getFactoryByString('ApplicationEventService');
	t.assert(appService);
});
