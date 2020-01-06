/**
 * Gets the Element Name from the Component's constructor name
 * Example: "SearchBarComponent" will return "search-bar"
 *
 * @param {string} name - Name of component
 * @returns {string} - Resulting element string
 */
export function getElNameFromComponent(name) {
	return name.replace('Component', '').replace(/\B(?=[A-Z])/g, '-').toLowerCase();
}
