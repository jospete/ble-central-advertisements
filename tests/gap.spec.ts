import { GapManufacturerData, parseAdvertisementManufacturerMetadata, parseGapAttributesDictionary } from '../src';

describe('GAP Utilities', () => {

	describe('parseGapAttributesDictionary', () => {

		it('returns an empty object when the provided input is not a Uint8Array', () => {
			expect(parseGapAttributesDictionary(null as any)).toEqual({});
		});
	});

	describe('parseAdvertisementManufacturerMetadata', () => {

		it('splits out the manufacturer ID from the provided buffer', () => {

			const input = Uint8Array.of(0x12, 0x34, 0x56, 0x78);

			const expectedOutput: GapManufacturerData = {
				manufacturerId: 0x3412,
				manufacturerData: Uint8Array.of(0x56, 0x78)
			};

			expect(parseAdvertisementManufacturerMetadata(input)).toEqual(expectedOutput);
		});

		it('returns a default empty result when given non Uint8Array input', () => {

			const expectedOutput: GapManufacturerData = {
				manufacturerId: 0,
				manufacturerData: null as any
			};

			expect(parseAdvertisementManufacturerMetadata(null as any)).toEqual(expectedOutput);
		});
	});
});