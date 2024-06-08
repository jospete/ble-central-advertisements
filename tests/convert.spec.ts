import { Convert } from '../src';

describe('Convert', () => {
	describe('byteToHex', () => {
		it('converts a value to its equivalent hex string', () => {
			expect(Convert.byteToHex(0xFF)).toBe('ff');
		});

		it('returns 00 for non integer values', () => {
			expect(Convert.byteToHex(null as any)).toBe('00');
			expect(Convert.byteToHex(5.26)).toBe('00');
		});

		it('clamps the input value to the proper byte range', () => {
			expect(Convert.byteToHex(-5)).toBe('fb');
		});

		it('properly pads output for single-character values', () => {
			expect(Convert.byteToHex(5)).toBe('05');
		});
	});

	describe('uint8ArrayToUTF8', () => {
		it('parses a Uint8Array to its utf-8 equivalent', () => {
			const output = 'Hello Test!';
			const input = new TextEncoder().encode(output);
			expect(Convert.uint8ArrayToUTF8(input)).toBe(output);
		});

		it('returns an empty string for non Uint8Array values', () => {
			expect(Convert.uint8ArrayToUTF8(null as any)).toBe('');
			expect(Convert.uint8ArrayToUTF8(undefined as any)).toBe('');
			expect(Convert.uint8ArrayToUTF8('' as any)).toBe('');
			expect(Convert.uint8ArrayToUTF8(0 as any)).toBe('');
			expect(Convert.uint8ArrayToUTF8({} as any)).toBe('');
			expect(Convert.uint8ArrayToUTF8(new ArrayBuffer(5) as any)).toBe('');
		});
	});

	describe('splitHex', () => {
		it('properly chunks hex strings into byte segments', () => {
			const rawHex = '112233aabbcc';
			const expectedOutput = ['11', '22', '33', 'aa', 'bb', 'cc'];
			expect(Convert.splitHex(rawHex)).toEqual(expectedOutput);
		});

		it('returns an empty array when given a non hex value', () => {
			expect(Convert.splitHex('zzzzok')).toEqual([]);
		});

		it('returns an empty array if anything in the string is not hex', () => {
			expect(Convert.splitHex('test string abc102 yup')).toEqual([]);
			expect(Convert.splitHex('abc102')).toEqual(['ab', 'c1', '02']);
		});

		it('automatically pads hex strings that are not the proper length', () => {
			expect(Convert.splitHex('12345')).toEqual(['01', '23', '45']);
		});

		it('returns an empty array for non-hex-string inputs', () => {
			expect(Convert.splitHex(null as any)).toEqual([]);
			expect(Convert.splitHex(undefined as any)).toEqual([]);
			expect(Convert.splitHex({} as any)).toEqual([]);
			expect(Convert.splitHex(0 as any)).toEqual([]);
			expect(Convert.splitHex('' as any)).toEqual([]);
		});
	});

	describe('hexToUint8Array', () => {
		it('parses a sequence of hex values to bytes', () => {
			const inputRaw = '020106030309181409546865726d6f6d65746572204578616d706c65';
			const input = '02 01 06 03 03 09 18 14 09 54 68 65 72 6d 6f 6d 65 74 65 72 20 45 78 61 6d 70 6c 65'.replace(/ /g, '');
			expect(input).toEqual(inputRaw);

			const expectedOutput = Uint8Array.from([
				0x02, 0x01, 0x06, 0x03, 0x03, 0x09, 0x18, 0x14, 0x09, 0x54, 0x68, 0x65, 0x72, 0x6D,
				0x6F, 0x6D, 0x65, 0x74, 0x65, 0x72, 0x20, 0x45, 0x78, 0x61, 0x6D, 0x70, 0x6C, 0x65
			]);

			expect(Convert.hexToUint8Array(input)).toEqual(expectedOutput);
		});
	});

	describe('uint8ArrayToHex', () => {
		it('parses a sequence of byte values to hex', () => {
			const input = Uint8Array.from([
				0x02, 0x01, 0x06, 0x03, 0x03, 0x09, 0x18, 0x14, 0x09, 0x54, 0x68, 0x65, 0x72, 0x6D,
				0x6F, 0x6D, 0x65, 0x74, 0x65, 0x72, 0x20, 0x45, 0x78, 0x61, 0x6D, 0x70, 0x6C, 0x65
			]);

			const expectedOutput = '020106030309181409546865726d6f6d65746572204578616d706c65';

			expect(Convert.uint8ArrayToHex(input)).toEqual(expectedOutput);
		});

		it('returns an empty string for non Uint8Array values', () => {
			expect(Convert.uint8ArrayToHex(null as any)).toBe('');
			expect(Convert.uint8ArrayToHex(undefined as any)).toBe('');
			expect(Convert.uint8ArrayToHex({} as any)).toBe('');
			expect(Convert.uint8ArrayToHex(0 as any)).toBe('');
			expect(Convert.uint8ArrayToHex('' as any)).toBe('');
		});
	});
});