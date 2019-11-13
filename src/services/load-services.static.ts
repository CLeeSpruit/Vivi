import { ViviServiceConstructor, Service } from '../models';
import { ApplicationEventService } from './application-event.service';
import { FactoryService } from './factory.service';
import { ParseEngineService } from './parse-engine.service';

export const loadViviServices: Array<ViviServiceConstructor<Service>> = [
    // Tier 0
    <ViviServiceConstructor<ApplicationEventService>>{ constructor: ApplicationEventService },
    <ViviServiceConstructor<FactoryService>>{ constructor: FactoryService },
    <ViviServiceConstructor<ParseEngineService>>{ constructor: ParseEngineService, prereqArr: [FactoryService] }
];