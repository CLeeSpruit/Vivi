import { ViviServiceFactory } from '../';
import { MockService, MockWithPrereqService } from '../../models/__mocks__/service.class';
import { Mocker } from '../../meta/mocker';

describe('ServiceFactory', () => {
    const mock = new Mocker();
    let factory: ViviServiceFactory<MockService>;

    beforeEach(() => {
        factory = mock.module.getFactory(MockService) as ViviServiceFactory<MockService>;
        factory.create();
    });

    afterEach(() => {
        mock.clearMocks();
        factory.destroyAll();
    });

    describe('init', () => {
        it('should init', () => {
            const service = new ViviServiceFactory<MockService>(MockService);
            expect(service).toBeTruthy();
        });

        it('should set prereqs if provided', () => {
            const prereqFactory = mock.module.getFactory(MockWithPrereqService) as ViviServiceFactory<MockWithPrereqService>;

            expect(prereqFactory.prerequisites.size).toEqual(1);
        });
    });

    describe('create', () => {
        it('should create a new instance of a service', () => {
            const service = factory.create();

            expect(service).toBeTruthy();
            expect(service).toBeInstanceOf(MockService);
        });
    });

    describe('get', () => {
        it('should return service if id is provided', () => {
            const service = factory.create();

            const actual = factory.get(service.id);

            expect(actual).toBeTruthy();
        });

        it('should return the first service if no id is provided', () => {
            const toBeRemoved = factory.get();
            factory.destroy(toBeRemoved.id);

            const actual = factory.get();
            expect(actual).toBeNull();
        });
    });

    describe('destroy', () => {
        it('should trigger service destroy', () => {
            const service = factory.create();
            const destroySpy = spyOn(service, 'destroy');
            const sizeBefore = factory.instances.size;

            factory.destroy(service.id);

            expect(destroySpy).toHaveBeenCalledTimes(1);
            expect(factory.instances.size).toEqual(sizeBefore - 1);
        });
    });

    describe('destroy all', () => {
        it('should remove all instances', () => {
            factory.create();
            factory.create();

            factory.destroyAll();
            expect(factory.instances.size).toEqual(0);
        });
    });
});