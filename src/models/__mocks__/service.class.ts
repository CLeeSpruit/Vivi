import { Service } from '../service.class';

export class MockService extends Service {
    constructor() {
        super();
    }
}

export class MockWithPrereqService extends Service {
    constructor(private MockService: MockService) {
        super();
    }
}