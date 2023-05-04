export function isObject(value: unknown): boolean {
    return typeof value === 'object' && value !== null;
}

export function isNumber(value: unknown): boolean {
    return typeof value === 'number' && !Number.isNaN(value);
}

export function isInteger(value: unknown): boolean {
    return isNumber(value) && (value as number) % 1 === 0;
}

export function parseAsciiString(data: Uint8Array): string {

	if (!(data instanceof Uint8Array))
		return '';

	let chars: string[] = [];

	for (let i = 0; i < data.byteLength; i++)
		chars[i] = String.fromCharCode(data[i]);

	return chars.join('');
}

export function parseHex(byte: number): string {
	if (!isInteger(byte) || byte < 0 || byte > 0xFF)
		return '00';
	return byte.toString(16).padStart(2, '0');
}

export function parseHexString(data: Uint8Array): string {

	if (!(data instanceof Uint8Array))
		return '';

	let chars: string[] = [];

	for (let i = 0; i < data.byteLength; i++)
		chars[i] = parseHex(data[i]);

	return chars.join('');
}

export function parse16BitServiceUuids(data: Uint8Array): string[] {

	const result: string[] = [];

	if (data instanceof Uint8Array) {

		for (let i = 0; i < data.byteLength; i += 2)
			result.push(parseHexString(data.slice(i, i + 2)));
	}

	return result;
}