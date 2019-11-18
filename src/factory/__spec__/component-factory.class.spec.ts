import { ViviComponentFactory } from '../';
import { MockComponent } from '../../models/__mocks__/component.class';
import { Mocker } from '../../meta/mocker';
import { NodeTreeService } from '../../services';

describe('Component Factory', () => {
    const mock = new Mocker();

    afterEach(() => {
        mock.clearMocks();
    });

    it('should init', () => {
        const mock = new ViviComponentFactory<MockComponent>(MockComponent);

        expect(mock).toBeTruthy();
    });

    describe('create', () => {
        it('should create a new component and return that component', () => {
            const mock = new ViviComponentFactory<MockComponent>(MockComponent);

            const component = mock.create(null, null, true);

            expect(component).toBeTruthy();
            expect(component instanceof MockComponent).toBeTruthy();
        });

        it('should create with services', () => {
            const comp = mock.createMock() as MockComponent;

            expect(comp.mockService).toBeTruthy();
        });
    });

    describe('create root', () => {
        it('should create component and set root in nodeTreeService', () => {
            const mock = new ViviComponentFactory<MockComponent>(MockComponent);
            const nodeTreeService = new NodeTreeService();
            const rootSpy = spyOn(nodeTreeService, 'setRoot');

            const comp = mock.createRoot(nodeTreeService);
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

        it('get should return first component created if no id is provided', () => {
            const componentA = mock.createMock();
            const componentB = mock.createMock();

            expect(mock.getFactory().get()).toEqual(componentA);
        });

        it('get should return null if no id is provided and no components have been created', () => {
            expect(mock.getFactory().get()).toEqual(null);
        });
    });

    describe('destroy', () => {
        it('should trigger component.destroy', () => {
            const comp = mock.createMock();
            const destroySpy = spyOn(comp, 'destroy');
            comp.append();

            mock.getFactory().destroy(comp.id);

            expect(destroySpy).toHaveBeenCalledTimes(1);
        });

        it('should remove from the DOM', () => {
            const comp = mock.createMock();
            comp.append();

            mock.getFactory().destroy(comp.id);

            const actual = document.getElementById(comp.id);
            expect(actual).toBeFalsy();
        });

        it('should remove from the factory map', () => {
            const comp = mock.createMock();
            comp.append();

            mock.getFactory().destroy(comp.id);

            const actual = mock.getFactory().get(comp.id);
            expect(actual).toBeFalsy();
        });

        it('should throw error if component does not exist', () => {
            const errorSpy = spyOn(console, 'error');
            mock.getFactory().destroy('blah blah');

            expect(errorSpy).toHaveBeenCalled();
        });
    });
});
