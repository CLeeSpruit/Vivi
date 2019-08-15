export abstract class ComponentParams {
    constructor(obj?: ComponentParams) {
        if (obj) {
            Object.keys(obj).forEach(key => {
                this[key] = obj[key];
            });
        }
    }
}