export const loadViviServices = [
    // Tier 0
    { constructor: ApplicationEventService },
    { constructor: FactoryService },
    { constructor: NodeTreeService },
    { constructor: ParseEngineService, prereqArr: [FactoryService] },
];