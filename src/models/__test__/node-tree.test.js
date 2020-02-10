import test from 'ava';
import {NodeTree} from '../node-tree';

let tree;
let child;
let grandChild;
function setupChildren() {
	tree = new NodeTree({id: 'parent'});
	child = new NodeTree({id: 'child'});
	grandChild = new NodeTree({id: 'grandchild'});
	child.addChild(grandChild);
	tree.addChild(child);
}

test('should init', t => {
	const tree = new NodeTree({id: 'test'});

	t.assert(tree);
});

test('addChild should add a new node tree to children', t => {
	const tree = new NodeTree({id: 'parent'});
	const child = new NodeTree({id: 'child'});
	tree.addChild(child);

	t.is(tree.children.size, 1);
});

test('removeChild should remove child and return removed node', t => {
	setupChildren();
	const removedNode = tree.removeChild(child.component.id);

	t.is(removedNode, child);
});

test('removeChild should return null if child is not found', t => {
	setupChildren();
	const removedNode = tree.removeChild('invalid');

	t.falsy(removedNode);
});

test('findChild should find child if exists', t => {
	setupChildren();
	const found = tree.findChild(child.component.id);

	t.is(found, child);
});

test('findChild should ignore child if it does not exist as a direct child and deepSearch is false', t => {
	setupChildren();
	const found = tree.findChild(grandChild.component.id);

	t.falsy(found);
});

test('findChild should find child if exists not as a direct child and deepSearch is true', t => {
	setupChildren();
	const found = tree.findChild(grandChild.component.id, true);

	t.truthy(found);
});

test('findChild should return node if returnNode is true', t => {
	setupChildren();
	const found = tree.findChild(child.component.id, false, true);

	t.is(found, child);
});

test('findChild should return null if nothing is found', t => {
	setupChildren();
	const found = tree.findChild('invalid', false, true);

	t.falsy(found);
});

test('findParentOf should return itself if it is the parent', t => {
	setupChildren();
	const found = tree.findParentOf(child.component.id);

	t.is(found, tree);
});

test('findParentOf should return parent if parent exists', t => {
	setupChildren();
	const found = tree.findParentOf(grandChild.component.id);
	t.is(found, child);
});

test('findParentOf should return null if there is no parent', t => {
	setupChildren();

	t.falsy(tree.findParentOf('invalid'));
});

test('hasChild should return true if child exists', t => {
	setupChildren();
	const found = tree.hasChild(child.component.id);

	t.truthy(found);
});

test('hasChild should return false if child does not exist', t => {
	setupChildren();
	const found = tree.hasChild('invalid');
	t.falsy(found);
});
