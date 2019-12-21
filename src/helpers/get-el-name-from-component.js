export function getElNameFromComponent(name) {
	return name.replace('Component', '').replace(/\B(?=[A-Z])/g, '-').toLowerCase();
}
