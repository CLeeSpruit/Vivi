import {Service} from '../service';

export class MockService extends Service {}

export class MockWithPrereqService extends Service {
	constructor(mockService) {
		super();
		this.mockService = mockService;
	}
}
