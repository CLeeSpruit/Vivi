import test from 'ava';
import {Nodes} from '../../src/services/nodes';
import {MockComponent} from '../../src/models/__mocks__/component.mock';
import {ModuleFactory} from '../../src/factory/module-factory';

let vivi;
let service;
let rootComponent;

test.before(() => {
	vivi = new ModuleFactory({componentConstructors: [MockComponent]});
	service = vivi.get(Nodes);
	rootComponent = vivi.getFactory(MockComponent).createRoot();
});

test('getNode should get node of a component', t => {
	// Create appends a node to parent
	const child = vivi.getFactory(MockComponent).create(rootComponent);
	const node = service.getNode(child.id);
	t.assert(node);
});

test('getNode should be able to get root', t => {
	const node = service.getNode(rootComponent.id);
	t.assert(node);
});
