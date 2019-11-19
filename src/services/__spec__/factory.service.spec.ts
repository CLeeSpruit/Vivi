import { FactoryService } from '../factory.service';
import { ComponentFactory, ServiceFactory } from '../../factory';
import { MockComponent } from '../../models/__mocks__/component.class';
import { ApplicationEventService } from '../application-event.service';
import { Mocker } from '../../meta/mocker';

describe('Factory Service', () => {
    const mock = new Mocker();
    const service = mock.module.get(FactoryService) as FactoryService;

    it('should init', () => {
        expect(service).toBeTruthy();
    });

    it('getFactory should be able to return factory of a component', () => {
        const component = service.getFactory(MockComponent) as ComponentFactory<MockComponent>;

        expect(component).toBeTruthy();
    });

    it('getFactory should be able to return factory of a service', () => {
        const appService = service.getFactory(ApplicationEventService) as ServiceFactory<ApplicationEventService>;

        expect(appService).toBeTruthy();
    });

    it('getFactoryByString should be able to return factory of a component', () => {
        const component = service.getFactoryByString('MockComponent') as ComponentFactory<MockComponent>;

        expect(component).toBeTruthy();
    });

    it('getFactoryByString should be able to return factory of a service', () => {
        const appService = service.getFactoryByString('ApplicationEventService') as ServiceFactory<ApplicationEventService>;

        expect(appService).toBeTruthy();
    });
});