import test from 'ava';
import {Nodes} from '../nodes';
import {NodeTree} from '../../models';

test('should init', t => {
	const actual = new Nodes({});
	t.assert(actual);
});

test('should set root node', t => {
	const nodes = new Nodes({});
	const tree = new NodeTree();
	nodes.setRoot(tree);

	t.is(nodes.applicationTree, tree);
});
