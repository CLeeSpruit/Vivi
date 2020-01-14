import test from 'ava';
import {ModuleFactory} from '../../src/factory/module-factory';
import {MockComponent, MockLoadComponent, MockLoadTemplateComponent} from '../../src/models/__mocks__/component.mock';
import {MockLogger} from '../../src/services/__mock__/logger.mock';

let vivi;

test.before(t => {
	vivi = new ModuleFactory(
		{
			componentConstructors: [MockComponent],
			rootComponent: MockComponent
		},
		{},
		[{key: 'Logger', override: MockLogger}]
	);
	vivi.get('Logger').setTest(t);
});

// Related to https://github.com/CassandraSpruit/Vivi/issues/14
test('it should not throw error when adding children to component', t => {
	const factory = vivi.createFactory(MockLoadComponent);
	const rootComponent = factory.createRoot();

	t.assert(rootComponent);
	t.assert(rootComponent.childComponent);
});

test('it should not throw error when adding children the root component when children are in the template', t => {
	const factory = vivi.createFactory(MockLoadTemplateComponent);
	const rootComponent = factory.createRoot();
	const nodes = vivi.get('Nodes');
	const rootNode = nodes.getNode(rootComponent);

	t.assert(rootComponent);
	t.assert(rootNode);
	t.is(rootNode.children.length, 1);
});
