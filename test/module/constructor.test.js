import test from 'ava';
import {ModuleFactory} from '../../src/factory/module-factory';
import {MockComponent} from '../../src/models/__mocks__/component.mock';
import {MockService} from '../../src/models/__mocks__/service.mock';
import {MockLogger} from '../../src/services/__mock__/logger.mock';

test('standard', t => {
	const vivi = new ModuleFactory({
		componentConstructors: [MockComponent],
		serviceConstructors: [MockService],
		rootComponent: MockComponent
	});

	t.assert(vivi);
});

test('minimum', t => {
	const vivi = new ModuleFactory();

	t.assert(vivi);
});

test('can override services - {key, override}', t => {
	const vivi = new ModuleFactory(null, null, [{key: 'Logger', override: MockLogger}]);

	t.assert(vivi);
	t.assert(vivi.get(MockLogger) instanceof MockLogger);
});

test('can override services - [service]', t => {
	const vivi = new ModuleFactory(null, null, [MockLogger]);

	t.assert(vivi);
	t.assert(vivi.get(MockLogger) instanceof MockLogger);
});

test('can override services with standard constructor', t => {
	const vivi = new ModuleFactory(
		{
			componentConstructors: [MockComponent],
			serviceConstructors: [MockService],
			rootComponent: MockComponent
		},
		{},
		[{key: 'Logger', override: MockLogger}]
	);

	t.assert(vivi);
	t.assert(vivi.get(MockLogger) instanceof MockLogger);
});

test('can override services with constructor without module.serviceConstructors', t => {
	const vivi = new ModuleFactory(
		{
			componentConstructors: [MockComponent],
			rootComponent: MockComponent
		},
		{},
		[{key: 'Logger', override: MockLogger}]
	);

	t.assert(vivi);
	t.assert(vivi.get(MockLogger) instanceof MockLogger);
});
