import { ViviServiceConstructor, Service } from '../models';
import { ApplicationEventService } from './application-event.service';
import { FactoryService } from './factory.service';
import { ParseEngineService } from './parse-engine.service';
import { NodeTreeService } from './node-tree.service';

export const loadViviServices: Array<ViviServiceConstructor<Service>> = [
    // Tier 0
    <ViviServiceConstructor<ApplicationEventService>>{ constructor: ApplicationEventService },
    <ViviServiceConstructor<FactoryService>>{ constructor: FactoryService },
    <ViviServiceConstructor<NodeTreeService>>{ constructor: NodeTreeService },
    <ViviServiceConstructor<ParseEngineService>>{ constructor: ParseEngineService, prereqArr: [FactoryService] },
];