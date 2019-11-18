import { ServiceConstructor } from '../models/service-constructor.interface';
import { ApplicationEventService } from './application-event.service';
import { FactoryService } from './factory.service';
import { NodeTreeService } from './node-tree.service';
import { ParseEngineService } from './parse-engine.service';

export const loadViviServices: Array<ServiceConstructor> = [
    // Tier 0
    <ServiceConstructor<ApplicationEventService>>{ constructor: ApplicationEventService },
    <ServiceConstructor<FactoryService>>{ constructor: FactoryService },
    <ServiceConstructor<NodeTreeService>>{ constructor: NodeTreeService },
    <ServiceConstructor<ParseEngineService>>{ constructor: ParseEngineService, prereqArr: [FactoryService] },
];