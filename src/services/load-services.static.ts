import { ViviServiceConstructor } from '@models/service-constructor.interface';
import { Service } from '@models/service.class';
import { ApplicationEventService } from '@services/application-event.service';
import { FileService } from '@services/file.service';
import { SystemService } from '@services/system.service';

export const loadViviServices: Array<ViviServiceConstructor<Service>> = [
    // Tier 0
    <ViviServiceConstructor<ApplicationEventService>>{ constructor: ApplicationEventService },
    <ViviServiceConstructor<SystemService>>{ constructor: SystemService },

    // Tier 1
    <ViviServiceConstructor<FileService>>{ constructor: FileService, prereqArr: [SystemService] },
];