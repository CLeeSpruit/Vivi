import { ViviServiceConstructor, Service } from '../models';
import { ApplicationEventService, FileService, SystemService } from './';

export const loadViviServices: Array<ViviServiceConstructor<Service>> = [
    // Tier 0
    <ViviServiceConstructor<ApplicationEventService>>{ constructor: ApplicationEventService },
    <ViviServiceConstructor<SystemService>>{ constructor: SystemService },

    // Tier 1
    <ViviServiceConstructor<FileService>>{ constructor: FileService, prereqArr: [SystemService] },
];