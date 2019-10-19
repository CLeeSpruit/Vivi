import { ViviServiceConstructor, Service } from '../models';
import { ApplicationEventService, FactoryService } from './';

export const loadViviServices: Array<ViviServiceConstructor<Service>> = [
    // Tier 0
    <ViviServiceConstructor<ApplicationEventService>>{ constructor: ApplicationEventService },
    <ViviServiceConstructor<FactoryService>>{ constructor: FactoryService }
];