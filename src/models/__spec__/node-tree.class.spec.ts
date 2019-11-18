import { NodeTree } from '../node-tree';
import { Mocker } from '../../meta/mocker';

describe('NodeTree', () => {
    const mock = new Mocker();
    afterEach(() => {
        mock.clearMocks();
    });
    it('should init', () => {
        const comp = mock.createMock();
        const tree = new NodeTree(comp);

        expect(tree).toBeTruthy();
        expect(tree.component).toEqual(comp);
    });

    describe('addChild', () => {
        it('should add a new node tree to children', () => {
            const comp = mock.createMock();
            const tree = new NodeTree(comp);
            const child = mock.createMock();
    
            tree.addChild(child);
    
            expect(tree.children.length).toEqual(1);
            expect(tree.children[0].component).toEqual(child);
        });
    });

    describe('findChild', () => {
        it('should find child if exists', () => {
            const comp = mock.createMock();
            const tree = new NodeTree(comp);
            const child = mock.createMock();
            tree.addChild(child);

            const found = tree.findChild(child.id);

            expect(found).toEqual(child);
        });

        it('should ignore child if it does not exist as a direct child and deepSearch is false', () => {
            const comp = mock.createMock();
            const tree = new NodeTree(comp);
            const child = mock.createMock();
            const grandchild = mock.createMock();
            const node = tree.addChild(child);
            node.addChild(grandchild);

            const found = tree.findChild(grandchild.id);

            expect(found).toBeFalsy();
        });

        it('should find child if exists not as a direct child and deepSearch is true', () => {
            const comp = mock.createMock();
            const tree = new NodeTree(comp);
            const child = mock.createMock();
            const grandchild = mock.createMock();
            const node = tree.addChild(child);
            node.addChild(grandchild);

            const found = tree.findChild(grandchild.id, true);

            expect(found).toBeTruthy();
        });

        it('should return node if returnNode is true', () => {
            const comp = mock.createMock();
            const tree = new NodeTree(comp);
            const child = mock.createMock();
            const node = tree.addChild(child);

            const found = tree.findChild(child.id, false, true);

            expect(found).toEqual(node);
        });

        it('should return null if nothing is found', () => {
            const comp = mock.createMock();
            const tree = new NodeTree(comp);
            const child = mock.createMock();

            const found = tree.findChild(child.id, false, true);

            expect(found).toBeFalsy();
        });
    });
});