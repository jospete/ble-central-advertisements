import { isIOSAdvertisingData } from '../src';

describe('Plugin Advertisement Utilities', () => {
	describe('isIOSAdvertisingData', () => {
		it('returns true if any of the known iOS property map keys exists on the object', () => {
			expect(isIOSAdvertisingData(null)).toBe(false);
			expect(isIOSAdvertisingData(undefined)).toBe(false);
			expect(isIOSAdvertisingData({ arbitraryProp: 1 })).toBe(false);
			expect(isIOSAdvertisingData({ kCBAdvDataIsConnectable: true })).toBe(true);
		});
	});
});