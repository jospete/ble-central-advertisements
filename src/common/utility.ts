export function isObject(value: unknown): boolean {
	return typeof value === 'object' && value !== null;
}

export function isNumber(value: unknown): boolean {
	return typeof value === 'number' && !Number.isNaN(value);
}

export function isString(value: unknown): boolean {
	return typeof value === 'string';
}

export function isUndefined(value: unknown): boolean {
	return typeof value === 'undefined';
}

export function isInteger(value: unknown): boolean {
	return isNumber(value) && ((value as number) % 1 === 0);
}

export function isArrayBuffer(value: unknown): boolean {
	return isObject(value) && (value instanceof ArrayBuffer);
}

export function isUint8Array(value: unknown): boolean {
	return isObject(value) && (value instanceof Uint8Array);
}

export function removeUndefinedEntries<T>(value: T): T {

	for (const key in value)
		if (isUndefined(value[key]))
			delete value[key];

	return value;
} 