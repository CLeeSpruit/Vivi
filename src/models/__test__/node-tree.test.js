import test from 'ava';
import {NodeTree} from '../node-tree';
import {ModuleFactory} from '../../factory/module-factory';
import {MockComponent} from '../__mocks__/component.mock';

let vivi;
let factory;
let rootComponent;

test.before(() => {
	vivi = new ModuleFactory();
	factory = vivi.createFactory(MockComponent);
	rootComponent = factory.createRoot();
});

test('should init', t => {
	const comp = factory.create(rootComponent);
	const tree = new NodeTree(comp);

	t.assert(tree);
	t.is(tree.component, comp);
});

test('addChild should add a new node tree to children', t => {
	const comp = factory.create(rootComponent);
	const tree = new NodeTree(comp);
	const child = factory.create(comp);

	tree.addChild(child);

	t.is(tree.children.length, 1);
	t.is(tree.children[0].component, child);
});

test('removeChild should remove child and return removed node', t => {
	const comp = factory.create(rootComponent);
	const child = factory.create(comp);
	const tree = new NodeTree(comp);
	const addedNode = tree.addChild(child);
	const removedNode = tree.removeChild(child);

	t.is(removedNode, addedNode);
});

test('removeChild should return null if child is not found', t => {
	const comp = factory.create(rootComponent);
	const child = factory.create(comp);
	const tree = new NodeTree(comp);
	const removedNode = tree.removeChild(child);

	t.falsy(removedNode);
});

test('findChild should find child if exists', t => {
	const comp = factory.create(rootComponent);
	const tree = new NodeTree(comp);
	const child = factory.create(comp);
	tree.addChild(child);

	const found = tree.findChild(child.id);

	t.is(found, child);
});

test('findChild should ignore child if it does not exist as a direct child and deepSearch is false', t => {
	const comp = factory.create(rootComponent);
	const tree = new NodeTree(comp);
	const child = factory.create(comp);
	const grandchild = factory.create(child);
	const node = tree.addChild(child);
	node.addChild(grandchild);

	const found = tree.findChild(grandchild.id);

	t.falsy(found);
});

test('findChild should find child if exists not as a direct child and deepSearch is true', t => {
	const comp = factory.create(rootComponent);
	const tree = new NodeTree(comp);
	const child = factory.create(comp);
	const grandchild = factory.create(child);
	const node = tree.addChild(child);
	node.addChild(grandchild);

	const found = tree.findChild(grandchild.id, true);
	t.truthy(found);
});

test('findChild should return node if returnNode is true', t => {
	const comp = factory.create(rootComponent);
	const tree = new NodeTree(comp);
	const child = factory.create(comp);
	const node = tree.addChild(child);

	const found = tree.findChild(child.id, false, true);
	t.is(found, node);
});

test('findChild should return null if nothing is found', t => {
	const comp = factory.create(rootComponent);
	const tree = new NodeTree(comp);
	const child = factory.create(comp);

	const found = tree.findChild(child.id, false, true);
	t.falsy(found);
});

test('findParentOf should return itself if it is the parent', t => {
	const comp = factory.create(rootComponent);
	const child = factory.create(comp);
	const tree = new NodeTree(comp);
	tree.addChild(child);

	t.is(tree.findParentOf(child.id), tree);
});

test('findParentOf should return parent if parent exists', t => {
	const comp = factory.create(rootComponent);
	const child = factory.create(comp);
	const grandChild = factory.create(child);
	const tree = new NodeTree(comp);
	const childNode = tree.addChild(child);
	childNode.addChild(grandChild);

	t.is(tree.findParentOf(grandChild.id), childNode);
});

test('findParentOf should return null if there is no parent', t => {
	const comp = factory.create(rootComponent);
	const sassyChild = factory.create(comp);
	const tree = new NodeTree(comp);

	t.falsy(tree.findParentOf(sassyChild.id));
});

test('hasChild should return true if child exists', t => {
	const comp = factory.create(rootComponent);
	const child = factory.create(comp);
	const tree = new NodeTree(comp);
	tree.addChild(child);

	t.truthy(tree.hasChild(child.id));
});

test('hasChild should return false if child does not exist', t => {
	const comp = factory.create(rootComponent);
	const child = factory.create(comp);
	const tree = new NodeTree(comp);

	t.falsy(tree.hasChild(child.id));
});
