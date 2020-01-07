import test from 'ava';
import {NodeTreeService} from '../node-tree.service';
import {NodeTree} from '../../models/node-tree';
import {ModuleFactory} from '../../factory/module-factory';
import {MockComponent} from '../../models/__mocks__/component.mock';

const vivi = new ModuleFactory({componentConstructors: [MockComponent]});
test.afterEach(() => {
	vivi.clearAll();
});

test('should init', t => {
	const actual = new NodeTreeService(vivi);
	t.assert(actual);
});

test('setRoot should set the application tree', t => {
	const service = vivi.get(NodeTreeService);
	const rootComponent = vivi.getFactory(MockComponent).create();

	service.setRoot(rootComponent);

	t.assert(service.applicationTree);
});

test('getNode should get node of a component', t => {
	const service = new NodeTreeService(vivi);
	const rootComponent = vivi.getFactory(MockComponent).create();
	service.setRoot(rootComponent);
	const child = vivi.getFactory(MockComponent).create();
	service.addComponent(rootComponent, child);

	const node = service.getNode(child);
	t.assert(node);
});

test('getNode should be able to get root', t => {
	const service = new NodeTreeService();
	const rootComponent = vivi.getFactory(MockComponent).create();
	service.setRoot(rootComponent);

	const node = service.getNode(rootComponent);
	t.assert(node);
});

test('getNode should just return null if not found', t => {
	const service = new NodeTreeService();
	const rootComponent = vivi.getFactory(MockComponent).create();
	service.setRoot(rootComponent);
	const randoComponent = vivi.getFactory(MockComponent).create();

	const node = service.getNode(randoComponent);
	t.falsy(node);
});

test('getNode should return null if root is not set', t => {
	const service = new NodeTreeService();
	const randoComponent = vivi.getFactory(MockComponent).create();

	const node = service.getNode(randoComponent);
	t.falsy(node);
});

test('addComponent should add component to parent', t => {
	const service = new NodeTreeService();
	const rootComponent = vivi.getFactory(MockComponent).create();
	service.setRoot(rootComponent);

	const child = vivi.getFactory(MockComponent).create();
	service.addComponent(rootComponent, child);

	const parentNode = service.getNode(rootComponent);
	t.is(parentNode.children.length, 1);
});

test('addComponent should add component to root if no parentNode is defined', t => {
	const service = new NodeTreeService();
	const rootComponent = vivi.getFactory(MockComponent).create();
	service.setRoot(rootComponent);
	const rootNode = service.getNode(rootComponent);

	const child = vivi.getFactory(MockComponent).create();
	service.addComponent(null, child);
	t.is(rootNode.children.length, 1);
});

// Error handling
test.todo('addComponent should throw error if root component has not been set');

// Error handling
test.todo('addComponent should throw warning if parent does not exist in tree');

// Error handling
test.todo('addNodeToComponent should return error and do nothing if parent does not exist');

test('addNodeToComponent should add the node the parent node', t => {
	const service = new NodeTreeService();
	const rootComponent = vivi.getFactory(MockComponent).create();
	const child = vivi.getFactory(MockComponent).create();
	const childNode = new NodeTree(child);
	service.setRoot(rootComponent);
	const lengthBefore = service.applicationTree.children.length;

	service.addNodeToComponent(rootComponent, childNode);

	t.is(service.applicationTree.children.length, lengthBefore + 1);
});

test('loadComponent should load node tree', t => {
	const service = new NodeTreeService();
	const rootComponent = vivi.getFactory(MockComponent).create();
	service.setRoot(rootComponent);
	service.loadComponent(rootComponent);

	t.assert(rootComponent.element);
});

// Error handling
test.todo('loadComponent should throw error if node cannot be found');

test('detachComponent should remove the node and return it', t => {
	const service = new NodeTreeService();
	const rootComponent = vivi.getFactory(MockComponent).create();
	const child = vivi.getFactory(MockComponent).create();
	service.setRoot(rootComponent);
	const addedNode = service.addComponent(rootComponent, child);
	const detachedNode = service.detachComponent(child);
	t.is(addedNode, detachedNode);
	t.is(service.applicationTree.children.length, 0);
});

// Error Handling
test.todo('detachComponent should throw an error if component is not in tree');
