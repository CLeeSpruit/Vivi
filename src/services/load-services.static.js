import {ApplicationEventService} from './application-event.service';
import {FactoryService} from './factory.service';
import {NodeTreeService} from './node-tree.service';
import {ParseEngineService} from './parse-engine.service';

export function loadViviServices() {
	return [
		// Tier 0
		{constructor: ApplicationEventService},
		{constructor: FactoryService},
		{constructor: NodeTreeService},
		{constructor: ParseEngineService, prereqArr: [FactoryService]}
	];
}
