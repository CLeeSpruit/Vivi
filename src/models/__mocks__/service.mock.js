import { Service } from '../service';

export class MockService extends Service {
    constructor() {
        super();
    }
}

export class MockWithPrereqService extends Service {
    constructor(mockService) {
        super();
    }
}