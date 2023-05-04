export function isObject(value: unknown): boolean {
    return typeof value === 'object' && value !== null;
}

export function isNumber(value: unknown): boolean {
    return typeof value === 'number' && !Number.isNaN(value);
}

export function isInteger(value: unknown): boolean {
    return isNumber(value) && (value as number) % 1 === 0;
}