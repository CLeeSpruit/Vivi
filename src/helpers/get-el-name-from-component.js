export function GetElNameFromComponent(name) {
	return name.replace('Component', '').replace(/\B(?=[A-Z])/g, '-').toLowerCase();
}
