export class Service {
	setData(id) {
		this.id = `${this.constructor.name}-${id}`;
	}
}
