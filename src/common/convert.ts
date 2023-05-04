import { isInteger } from './utility';

export function byteToHex(byte: number): string {
	if (!isInteger(byte))
		return '00';
	return (byte & 0xFF).toString(16).padStart(2, '0');
}

export function uint8ArrayToUTF8(data: Uint8Array): string {

	if (!(data instanceof Uint8Array))
		return '';

	return new TextDecoder().decode(data.buffer);
}

export function hexToUint8Array(hex: string): Uint8Array {

	const hexChunks = Array.from(/^[A-Fa-f0-9]{2,}$/.exec(hex) || []);
	const bytes: number[] = [];

	for (let i = 0; i < hexChunks.length; i++)
		bytes[i] = parseInt(hexChunks[i].padStart(2, '0'), 16);

	return Uint8Array.from(bytes);
}

export function uint8ArrayToHex(data: Uint8Array): string {

	if (!(data instanceof Uint8Array))
		return '';

	let chars: string[] = [];

	for (let i = 0; i < data.byteLength; i++)
		chars[i] = byteToHex(data[i]);

	return chars.join('');
}

export function uint8ArrayTo16BitServiceUuids(data: Uint8Array): string[] {

	const result: string[] = [];

	if (data instanceof Uint8Array) {

		for (let i = 0; i < data.byteLength; i += 2)
			result.push(uint8ArrayToHex(data.slice(i, i + 2)));
	}

	return result;
}