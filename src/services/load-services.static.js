import {ApplicationEventService} from './application-event.service';
import {NodeTreeService} from './node-tree.service';
import {ParseEngineService} from './parse-engine.service';

export function loadViviServices() {
	return [
		// Tier 0
		{constructor: ApplicationEventService},
		{constructor: NodeTreeService},
		{constructor: ParseEngineService}
	];
}
