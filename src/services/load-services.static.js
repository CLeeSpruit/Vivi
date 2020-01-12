import {AppEvent} from './app-event';
import {Nodes} from './nodes';
import {Engine} from './engine';
import {Logger} from './logger';

/**
 * Array of services to be included in Module by default
 *
 * @returns {Array} - Array of service constructors
 * @private
 */
export function loadViviServices() {
	return [
		AppEvent,
		Logger,
		Nodes,
		Engine
	];
}
