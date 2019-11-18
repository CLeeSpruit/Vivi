import { ViviComponentFactory, ViviServiceFactory, ModuleFactory } from '../';
import { MockComponent, MockChildComponent } from '../../models/__mocks__/component.class';
import { MockService, MockWithPrereqService } from '../../models/__mocks__/service.class';

describe('Class: Module Factory', () => {
    const minimumConstructor = () => {
        return new ModuleFactory({
            componentConstructors: [{constructor: MockComponent}],
            rootComponent: MockComponent
        });
    }

    const fullConstructor = () => {
        return new ModuleFactory({
            serviceConstructors: [
                { constructor: MockService },
                { constructor: MockWithPrereqService, prereqArr: [MockService] }
            ],
            componentConstructors: [
                { constructor: MockChildComponent },
                { constructor: MockComponent, services: [MockService] }
            ],
            rootComponent: MockComponent
        });
    }

    it('init - minimum', () => {
        const vivi = minimumConstructor();

        expect(vivi).toBeTruthy();
    });

    it('init - full', () => {
        const vivi = fullConstructor();

        expect(vivi).toBeTruthy();
    });

    it('init - root component is created', () => {
        const vivi = new ModuleFactory({
            componentConstructors: [{ constructor: MockComponent, services: [MockService] }],
            serviceConstructors: [{ constructor: MockService }],
            rootComponent: MockComponent
        });

        expect(vivi).toBeTruthy();
        expect(vivi.get(MockComponent)).toBeTruthy();
    });

    describe('getFactory', () => {
        let vivi: ModuleFactory;
        beforeEach(() => {
            vivi = fullConstructor();
        });

        it('get factory should return ViviComponent', () => {
            const actual = vivi.getFactory(MockComponent);

            expect(actual instanceof ViviComponentFactory).toBeTruthy();
        });

        it('get factory should return service', () => {
            const actual = vivi.getFactory(MockService);

            expect(actual instanceof ViviServiceFactory).toBeTruthy();
        });

        it('get factory can be searched by string', () => {
            const actual = vivi.getFactoryByString('MockComponent');

            expect(actual instanceof ViviComponentFactory).toBeTruthy();
        });

        it('get factory should throw error if no service or component is found', () => {
            expect(() => { vivi.getFactoryByString('test'); }).toThrowError('No service or component for test');
        });
    });

    describe('get', () => {
        let vivi: ModuleFactory;
        beforeEach(() => {
            vivi = fullConstructor();
        });

        it('get should return component, if created', () => {
            // Create component
            const factory = <ViviComponentFactory<MockComponent>>vivi.getFactory(MockComponent);
            factory.create(null, null, true);
            const actual = vivi.get(MockComponent);

            expect(actual instanceof MockComponent).toBeTruthy();
        });

        it('get should return ViviService', () => {
            // Create service
            const factory = <ViviServiceFactory<MockService>>vivi.getFactory(MockService);
            factory.create();

            const actual = vivi.get(MockService);

            expect(actual instanceof MockService).toBeTruthy();
        });

        it('get should throw error if no service or component is found', () => {
            expect(() => { vivi.getByString('test'); }).toThrowError('No service or component for test');
        });
    });

    describe('getComponentRegistry', () => {
        it('returns an array of component names in the module', () => {
            const vivi = fullConstructor();

            const actual = vivi.getComponentRegistry();

            expect(actual).toEqual(['MockChildComponent', 'MockComponent']);
        });
    });
});