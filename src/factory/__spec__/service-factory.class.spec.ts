import { ModuleFactory, ViviServiceFactory } from '../';
import { MockService, MockWithPrereqService } from '../../models/__mocks__/service.class';

describe('ServiceFactory', () => {
    const basicMock = () => { return new ViviServiceFactory<MockService>(MockService, []) };
    const mockModule = () => {
        return new ModuleFactory({
            serviceConstructors: [
                { constructor: MockService },
                { constructor: MockWithPrereqService, prereqArr: [MockService] }
            ]
        });
    };

    it('should init', () => {
        expect(basicMock()).toBeTruthy();
    });

    it('should set prereqs if provided', () => {
        const vivi = mockModule();

        const prereqFactory = vivi.getFactory(MockWithPrereqService) as ViviServiceFactory<MockWithPrereqService>;

        expect(prereqFactory.prerequisites.size).toEqual(1);
    });

    describe('create', () => {
        it('should create a new instance of a service', () => {
            const factory = basicMock();
            const service = factory.create();

            expect(service).toBeTruthy();
            expect(service).toBeInstanceOf(MockService);
        });
    });

    describe('get' , () => {
        it('should return service if id is provided', () => {
            const factory = basicMock();
            const service = factory.create();

            const actual = factory.get(service.id);

            expect(actual).toBeTruthy();
        });

        it('should return the first service if no id is provided', () => {
            const factory = basicMock();
            const toBeRemoved = factory.get();
            factory.destroy(toBeRemoved.id);

            const actual = factory.get();
            expect(actual).toBeNull();
        });
    });

    describe('destroy', () => {
        it('should trigger service destroy', () => {
            const factory = basicMock();
            const service = factory.get();
            const destroySpy = spyOn(service, 'destroy');

            factory.destroy(service.id);

            expect(destroySpy).toHaveBeenCalledTimes(1);
        });

        it('should remove from the map', () => {
            const factory = basicMock();
            const toBeRemoved = factory.get();
            factory.destroy(toBeRemoved.id);

            expect(factory.instances.size).toEqual(0);
        });
    });
});