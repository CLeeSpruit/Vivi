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

    describe('removeChild', () => {
        it('should remove child and return removed node', () => {
            const comp = mock.createMock();
            const child = mock.createMock();
            const tree = new NodeTree(comp);
            const addedNode = tree.addChild(child);
            const removedNode = tree.removeChild(child);

            expect(removedNode).toEqual(addedNode);
        });

        it('should return null if child is not found', () => {
            const comp = mock.createMock();
            const child = mock.createMock();
            const tree = new NodeTree(comp);
            const removedNode = tree.removeChild(child);

            expect(removedNode).toBeFalsy();
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
    
    describe('findParentOf', () => {
        it('should return itself if it is the parent', () => {
            const comp = mock.createMock();
            const child = mock.createMock();
            const tree = new NodeTree(comp);
            tree.addChild(child);
            
            expect(tree.findParentOf(child.id)).toEqual(tree);
        });

        it('should return parent if parent exists', () => {
            const comp = mock.createMock();
            const child = mock.createMock();
            const grandChild = mock.createMock();
            const tree = new NodeTree(comp);
            const childNode = tree.addChild(child);
            childNode.addChild(grandChild);
            
            expect(tree.findParentOf(grandChild.id)).toEqual(childNode);
        });

        it('should return null if there is no parent', () => {
            const comp = mock.createMock();
            const sassyChild = mock.createMock();
            const tree = new NodeTree(comp);

            expect(tree.findParentOf(sassyChild.id)).toBeFalsy();
        });
    });

    describe('hasChild', () => {
        it('should return true if child exists', () => {
            const comp = mock.createMock();
            const child = mock.createMock();
            const tree = new NodeTree(comp);
            tree.addChild(child);

            expect(tree.hasChild(child.id)).toBeTruthy();
        });

        it('should return false if child does not exist', () => {
            const comp = mock.createMock();
            const child = mock.createMock();
            const tree = new NodeTree(comp);

            expect(tree.hasChild(child.id)).toBeFalsy();
        });
    });

    describe('load', () => {
        it('should load component', () => {
            const comp = mock.createMock();
            const loadSpy = spyOn(comp, 'startLoad');
            const tree = new NodeTree(comp);

            tree.load();

            expect(loadSpy).toHaveBeenCalled();
        });

        it('should laod children', () => {
            const comp = mock.createMock();
            const child = mock.createMock();
            const loadChildSpy = spyOn(child, 'startLoad');
            const tree = new NodeTree(comp);
            tree.addChild(child);

            tree.load();

            expect(loadChildSpy).toHaveBeenCalled();
        });
    });

    describe('destroy', () => {
        it('should trigger component destroy', () => {
            const comp = mock.createMock();
            const tree = new NodeTree(comp);
            
            tree.destroy();

            expect(comp.element.isConnected).toBeFalsy();
        });

        it('should destroy children', () => {
            const comp = mock.createMock();
            const tree = new NodeTree(comp);
            const child = mock.createMock();
            tree.addChild(child);
            tree.destroy();

            expect(child.element.isConnected).toBeFalsy();
        });
    });
});