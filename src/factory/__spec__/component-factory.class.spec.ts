import { ComponentFactory } from '../';
import { MockComponent } from '../../models/__mocks__/component.class';
import { Mocker } from '../../meta/mocker';
import { NodeTreeService } from '../../services';

describe('Component Factory', () => {
    const mock = new Mocker();

    afterEach(() => {
        mock.clearMocks();
    });

    it('should init', () => {
        const mock = new ComponentFactory(MockComponent);

        expect(mock).toBeTruthy();
    });

    describe('create', () => {
        it('should create a new component and return that component', () => {
            const mock = new ComponentFactory(MockComponent);

            const component = mock.create(null, null, { isRoot: true });

            expect(component).toBeTruthy();
            expect(component instanceof MockComponent).toBeTruthy();
        });

        it('should create with services', () => {
            const comp = mock.createMock();

            expect(comp.mockService).toBeTruthy();
        });
    });

    describe('create root', () => {
        it('should create component and set root in nodeTreeService', () => {
            const mock = new ComponentFactory(MockComponent);
            const nodeTreeService = new NodeTreeService();
            const rootSpy = spyOn(nodeTreeService, 'setRoot').and.callThrough();

            mock.createRoot(nodeTreeService);
            const comp = mock.get();
            expect(rootSpy).toHaveBeenCalled();
            expect(comp).toBeTruthy();
        });
    });

    describe('get', () => {
        it('get should return specific component', () => {
            const componentA = mock.createMock();
            const componentB = mock.createMock();

            expect(mock.getFactory().get(componentA.id)).toEqual(componentA);
            expect(mock.getFactory().get(componentB.id)).toEqual(componentB);
        });

        it('get should return latest component created if no id is provided', () => {
            const componentA = mock.createMock();
            const componentB = mock.createMock();

            expect(mock.getFactory().get()).toEqual(componentB);
        });

        it('get should return null if no id is provided and no components have been created', () => {
            const mockFactory = new ComponentFactory(MockComponent);
            expect(mockFactory.get()).toEqual(null);
        });
    });

    describe('detach', () => {
        it('should throw error and do nothing if the component does not exist', () => {
            const errorSpy = spyOn(console, 'error');
            const actual = mock.getFactory().detach('blah');

            expect(errorSpy).toHaveBeenCalled();
            expect(actual).toBeFalsy();
        });

        it('should detach and return node tree', () => {
            const comp = mock.createMock();

            const actual = mock.getFactory().detach(comp.id);

            expect(actual).toBeTruthy();
            expect(actual.component.element.isConnected).toBeFalsy();
        });
    });

    describe('destroy', () => {
        it('should trigger component.destroy', () => {
            const comp = mock.createMock();
            const destroySpy = spyOn(comp, 'destroy');
            comp.append(document.body);

            mock.getFactory().destroy(comp.id);

            expect(destroySpy).toHaveBeenCalledTimes(1);
        });

        it('should remove from the DOM', () => {
            const comp = mock.createMock();
            comp.append(document.body);

            mock.getFactory().destroy(comp.id);

            const actual = document.getElementById(comp.id);
            expect(actual).toBeFalsy();
        });

        it('should remove from the factory map', () => {
            const comp = mock.createMock();
            expect(mock.getFactory().get(comp.id)).toBeTruthy();

            mock.getFactory().destroy(comp.id);

            const errorSpy = spyOn(console, 'error');
            expect(mock.getFactory().get(comp.id)).toBeFalsy();
            expect(errorSpy).toHaveBeenCalledTimes(1);
        });

        it('should throw error if component does not exist', () => {
            const errorSpy = spyOn(console, 'error');
            mock.getFactory().destroy('blah blah');

            expect(errorSpy).toHaveBeenCalled();
        });
    });
});
