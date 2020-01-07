import {ApplicationEventService} from './application-event.service';
import {NodeTreeService} from './node-tree.service';
import {ParseEngineService} from './parse-engine.service';
import {LoggerService} from './logger.service';

/**
 * Array of services to be included in Module by default
 *
 * @returns {Array} - Array of service constructors
 * @private
 */
export function loadViviServices() {
	return [
		ApplicationEventService,
		LoggerService,
		NodeTreeService,
		ParseEngineService
	];
}
