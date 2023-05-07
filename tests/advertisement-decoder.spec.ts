import { Advertisement, AdvertisementDecoder } from '../src';

describe('AdvertisementDecoder', () => {

	it('can be created with no arguments', () => {
		expect(new AdvertisementDecoder()).toBeTruthy();
	});

	it('does nothing when given invalid input', () => {
		const decoder = new AdvertisementDecoder();
		expect(decoder.decode(null as any)).toEqual(null as any);
	});

	it('accepts an ArrayBuffer directly as a decode input option', () => {

		const decoder = new AdvertisementDecoder();
		const input = Uint8Array.of(0, 1, 2, 3, 4, 5).buffer;
		const expectedOutput: Partial<Advertisement> = {
			gap: {},
			advDataLocalName: '',
			advDataServiceUUIDs: []
		};

		expect(decoder.decode(input)).toEqual(expectedOutput as any);
	});

	it('normalizes iOS advertising data', () => {

		const decoder = new AdvertisementDecoder();

		const iosAdvertisingData = {
			name: "demo",
			id: "15B4F1C5-C9C0-4441-BD9F-1A7ED8F7A365",
			advertising: {
				kCBAdvDataLocalName: "demo",
				kCBAdvDataManufacturerData: Uint8Array.of(0x00).buffer,
				kCBAdvDataServiceUUIDs: [
					"721b"
				],
				kCBAdvDataIsConnectable: true,
				kCBAdvDataServiceData: {
					"BBB0": Uint8Array.of(0x00).buffer,
				},
			},
			rssi: -61
		};

		const decoded = decoder.decode(iosAdvertisingData);

		const expectedOutput: Advertisement = {
			...iosAdvertisingData,
			advDataLocalName: iosAdvertisingData.advertising.kCBAdvDataLocalName,
			advDataIsConnectable: iosAdvertisingData.advertising.kCBAdvDataIsConnectable,
			advDataServiceData: iosAdvertisingData.advertising.kCBAdvDataServiceData,
			advDataManufacturerData: iosAdvertisingData.advertising.kCBAdvDataManufacturerData,
			advDataServiceUUIDs: iosAdvertisingData.advertising.kCBAdvDataServiceUUIDs
		};

		expect(decoded).toEqual(expectedOutput);
	});
});