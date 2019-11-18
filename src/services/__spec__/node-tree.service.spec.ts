import { NodeTreeService } from '../node-tree.service';
import { Mocker } from '../../meta/mocker';

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

        it('should throw error if root component has not been set', () => {
            const errorSpy = spyOn(console, 'error');
            const parent = mock.createMock();
            const child = mock.createMock();
            const service = new NodeTreeService();
            
            service.addComponent(parent, child);

            expect(errorSpy).toHaveBeenCalledTimes(1);
        });

        it('should throw warning if parent does not exist in tree', () => {
            const warningSpy = spyOn(console, 'error');
            const service = new NodeTreeService();
            const rootComponent = mock.createMock();
            const strangerDanger = mock.createMock();
            const child = mock.createMock();
            service.setRoot(rootComponent);

            service.addComponent(strangerDanger, child);

            expect(warningSpy).toHaveBeenCalledTimes(1);
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

        it('should throw warning if the node does not exist in tree', () => {
            const service = new NodeTreeService();
            const rootComponent = mock.createMock();
            service.setRoot(rootComponent);
            const randoComponent = mock.createMock();
            const warningSpy = spyOn(console, 'error');
            
            service.removeComponent(randoComponent);

            expect(warningSpy).toHaveBeenCalledTimes(1);
        });

        it('should still throw warning if the node is not in tree and no root is set', () => {
            const service = new NodeTreeService();
            const randoComponent = mock.createMock();
            const warningSpy = spyOn(console, 'error');
            
            service.removeComponent(randoComponent);

            expect(warningSpy).toHaveBeenCalledTimes(1);
        });
    });
});