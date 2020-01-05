export class Instance {
	/**
     *Creates an instance of Instance.
     * @param {FactoryService} factoryService
     * @memberof Instance
     */
	constructor(factoryService) {
		this.factoryService = factoryService;
	}

	/**
     *Assigns id, data, and sets any prereqs that are needed before loading
     *
     * @param {number} id
     * @param {*} data
     * @param {Array<string>} prereqs
     * @memberof Instance
     */
	setData(id, data, prereqs) {
		this.data = data || {};
		this.id = `${this.constructor.name}-${id}`;
		prereqs.forEach(req => {
			this[req] = this.factoryService.getFactoryByString(req);
		});
	}

	/**
	 *Placeholder for load hook function. If a component, will run after DOM loads. If service, will run after constructor.
	 *
	 * @memberof Instance
	 */
	load() {}
}
