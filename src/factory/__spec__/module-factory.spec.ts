import { ViviComponentFactory, ViviServiceFactory, ModuleFactory } from '../';
import { Component, ViviComponentConstructor, ViviServiceConstructor, Service } from '../../models';
jest.mock('../../services/system.service.ts');
import { SystemService } from '../../services/system.service';

describe('Class: Vivi Factory', () => {
    const minimumConstructor = () => {
        return new ModuleFactory({});
    }

    const fullConstructor = () => {
        return new ModuleFactory({
            serviceConstructors: [
                <ViviServiceConstructor<MockService>>{ constructor: MockService, prereqArr: [SystemService] }
            ],
            componentConstructors: [
                <ViviComponentConstructor<Component>>{ constructor: MockChildComponent },
                <ViviComponentConstructor<Component>>{ constructor: MockComponent, services: [MockService], children: [MockChildComponent] }
            ]
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
    });

    describe('get', () => {
        let vivi: ModuleFactory;
        beforeEach(() => {
            vivi = fullConstructor();
        });

        it('get should return component, if created', () => {
            // Create component
            const factory = <ViviComponentFactory<MockComponent>>vivi.getFactory(MockComponent);
            factory.create();
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
    });
});

// Generic Component class used for testing in this file
class MockComponent extends Component {
    constructor(private mockService: MockService) {
        super();
    }
}

class MockChildComponent extends Component {
    constructor() {
        super();
    }
}

// Generic Service used for testing in this file
class MockService extends Service {
    constructor(private system: SystemService) {
        super();
    }
}