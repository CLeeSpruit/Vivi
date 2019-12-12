export class FactoryService extends Service {
    module;

    constructor() {
        super();
        this.module = window.vivi;
    }

    getFactory(con) {
        return this.module.getFactory(con);
    }
    
    getFactoryByString(name) {
        return this.module.getFactoryByString(name);
    }
}