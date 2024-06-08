import { Utility } from './utility';

const { isInteger, isUint8Array, isString } = Utility

export namespace Convert {
	export function byteToHex(byte: number): string {
		if (!isInteger(byte))
			return '00';

		return (byte & 0xFF).toString(16).padStart(2, '0');
	}

	export function uint8ArrayToUTF8(data: Uint8Array): string {
		if (!isUint8Array(data))
			return '';

		return new TextDecoder().decode(data.buffer);
	}

	export function splitHex(hex: string): string[] {
		if (!isString(hex))
			return [];

		const match = /^[A-Fa-f0-9]+$/.exec(hex);

		if (!match)
			return [];

		let safeHex = match[0];

		if (safeHex.length % 2 !== 0)
			safeHex = '0' + safeHex;

		return Array.from(safeHex.match(/.{2}/g)!);
	}

	export function hexToUint8Array(hex: string): Uint8Array {
		const hexChunks = splitHex(hex);
		const bytes: number[] = [];

		for (let i = 0; i < hexChunks.length; i++)
			bytes[i] = parseInt(hexChunks[i], 16);

		return Uint8Array.from(bytes);
	}

	export function uint8ArrayToHex(data: Uint8Array): string {
		if (!isUint8Array(data))
			return '';

		let chars: string[] = [];

		for (let i = 0; i < data.byteLength; i++)
			chars[i] = byteToHex(data[i]);

		return chars.join('');
	}

	export function uint8ArrayTo16BitServiceUuids(data: Uint8Array): string[] {
		const result: string[] = [];

		if (isUint8Array(data)) {

			for (let i = 0; i < data.byteLength; i += 2) {
				const segment = data.slice(i, i + 2).reverse();
				result.push(uint8ArrayToHex(segment));
			}
		}

		return result;
	}
}