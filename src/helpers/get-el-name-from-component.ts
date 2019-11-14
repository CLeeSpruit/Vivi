export function GetElNameFromComponent(name: string): string {
    return name.replace('Component', '').replace(/\B(?=[A-Z])/g, '-').toLowerCase();
}