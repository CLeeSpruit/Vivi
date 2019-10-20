import { Service } from '../';

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