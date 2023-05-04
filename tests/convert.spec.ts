import {Convert} from '../src';

describe('Convert', () => {

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
	});

	describe('hexToUint8Array', () => {

		it('can parse sequences of hex values', () => {

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
});