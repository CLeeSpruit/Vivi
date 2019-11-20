import { NodeTreeService } from '../node-tree.service';
import { Mocker } from '../../meta/mocker';
import { NodeTree } from '../../models/node-tree';

describe('NodeTreeService', () => {
    const mock = new Mocker();

    afterEach(() => {
        mock.clearMocks();
    });

    it('should init', () => {
        const service = new NodeTreeService();

        expect(service).toBeTruthy();
    });

    describe('setRoot', () => {
        it('should set the appication tree', () => {
            const service = new NodeTreeService();
            const rootComponent = mock.createMock();

            service.setRoot(rootComponent);

            // If there's no root, adding throws an error
            const warningSpy = spyOn(console, 'error');
            const child = mock.createMock();
            service.addComponent(rootComponent, child);
            expect(warningSpy).not.toHaveBeenCalled();
        });
    });

    describe('getNode', () => {
        it('should get node of a component', () => {
            const service = new NodeTreeService();
            const rootComponent = mock.createMock();
            service.setRoot(rootComponent);
            const child = mock.createMock();
            service.addComponent(rootComponent, child);
            
            const node = service.getNode(child);

            expect(node).toBeTruthy();
        });

        it('should be able to get root', () => {
            const service = new NodeTreeService();
            const rootComponent = mock.createMock();
            service.setRoot(rootComponent);
            
            const node = service.getNode(rootComponent);

            expect(node).toBeTruthy();
        });

        it('should just return null if not found', () => {
            const service = new NodeTreeService();
            const rootComponent = mock.createMock();
            service.setRoot(rootComponent);
            const randoComponent = mock.createMock();

            const node = service.getNode(randoComponent);

            expect(node).toBeFalsy();
        });

        it('should return null if root is not set', () => {
            const service = new NodeTreeService();
            const randoComponent = mock.createMock();

            const node = service.getNode(randoComponent);

            expect(node).toBeFalsy();
        });
    });

    describe('addComponent', () => {
        it('should add component to parent', () => {
            const service = new NodeTreeService();
            const rootComponent = mock.createMock();
            service.setRoot(rootComponent);

            const child = mock.createMock();
            service.addComponent(rootComponent, child);

            const parentNode = service.getNode(rootComponent);
            expect(parentNode.children.length).toEqual(1);
        });

        it('should add component to root if no parentNode is defined', () => {
            const service = new NodeTreeService();
            const rootComponent = mock.createMock();
            service.setRoot(rootComponent);
            const rootNode = service.getNode(rootComponent);

            const child = mock.createMock();
            service.addComponent(null, child);

            expect(rootNode.children.length).toEqual(1);
        });

        it('should throw error if root component has not been set', () => {
            const errorSpy = spyOn(console, 'error');
            const parent = mock.createMock();
            const child = mock.createMock();
            const service = new NodeTreeService();
            
            service.addComponent(parent, child);

            expect(errorSpy).toHaveBeenCalledTimes(1);
        });

        it('should throw warning if parent does not exist in tree', () => {
            const errorSpy = spyOn(console, 'error');
            const service = new NodeTreeService();
            const rootComponent = mock.createMock();
            const strangerDanger = mock.createMock();
            const child = mock.createMock();
            service.setRoot(rootComponent);

            service.addComponent(strangerDanger, child);

            expect(errorSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('addNodeToComponent', () => {
        it('should return error and do nothing if parent does not exist', () => {
            const errorSpy = spyOn(console, 'error');
            const service = new NodeTreeService();
            const rootComponent = mock.createMock();
            const strangerDanger = mock.createMock();
            const child = mock.createMock();
            const childNode = new NodeTree(child);
            service.setRoot(rootComponent);

            service.addNodeToComponent(strangerDanger, childNode);

            expect(errorSpy).toHaveBeenCalled();
        });

        it('should add the node the parent node', () => {
            const service = new NodeTreeService();
            const rootComponent = mock.createMock();
            const child = mock.createMock();
            const childNode = new NodeTree(child);
            service.setRoot(rootComponent);
            const lengthBefore = service.applicationTree.children.length;

            service.addNodeToComponent(rootComponent, childNode);

            expect(service.applicationTree.children.length).toEqual(lengthBefore + 1);
        });
    });

    describe('loadComponent', () => {
        it('should load node tree', () => {
            const service = new NodeTreeService();
            const rootComponent = mock.createMock();
            service.setRoot(rootComponent);
            const rootNode = service.getNode(rootComponent);
            const loadSpy = spyOn(rootNode, 'load');

            service.loadComponent(rootComponent);

            expect(loadSpy).toHaveBeenCalled();
        });

        it('should throw error if node cannot be found', () => {
            const service = new NodeTreeService();
            const rootComponent = mock.createMock();
            const someComp = mock.createMock();
            service.setRoot(rootComponent);
            const errorSpy = spyOn(console, 'error');

            service.loadComponent(someComp);

            expect(errorSpy).toHaveBeenCalled();
        });
    });

    describe('removeComponent', () => {
        it('should remove component', () => {
            const service = new NodeTreeService();
            const rootComponent = mock.createMock();
            service.setRoot(rootComponent);
            const child = mock.createMock();
            service.addComponent(rootComponent, child);
            const node = service.getNode(child);
            const destroySpy = spyOn(node, 'destroy');

            service.removeComponent(child);

            expect(destroySpy).toHaveBeenCalled();
        });

        it('should be able to destroy root component', () => {
            const service = new NodeTreeService();
            const rootComponent = mock.createMock();
            service.setRoot(rootComponent);
            
            const node = service.getNode(rootComponent);
            const destroySpy = spyOn(node, 'destroy');

            service.removeComponent(rootComponent);

            expect(destroySpy).toHaveBeenCalled();
        });
    });

    describe('detachComponent', () => {
        it('should remove the node and return it', () => {
            const service = new NodeTreeService();
            const rootComponent = mock.createMock();
            const child = mock.createMock();
            service.setRoot(rootComponent);
            const addedNode = service.addComponent(rootComponent, child);
            const detachedNode = service.detachComponent(child);
            expect(addedNode).toEqual(detachedNode);
            expect(service.applicationTree.children.length).toEqual(0);
        });

        it('should throw an error if component is not in tree', () => {
            const service = new NodeTreeService();
            const rootComponent = mock.createMock();
            const child = mock.createMock();
            const errorSpy = spyOn(console, 'error');
            service.setRoot(rootComponent);
            const detachedNode = service.detachComponent(child);
            expect(detachedNode).toBeFalsy();
            expect(errorSpy).toHaveBeenCalled();
        });
    });
});