import { ViviServiceConstructor, Service } from '../models';
import { ApplicationEventService } from './';

export const loadViviServices: Array<ViviServiceConstructor<Service>> = [
    // Tier 0
    <ViviServiceConstructor<ApplicationEventService>>{ constructor: ApplicationEventService }
];