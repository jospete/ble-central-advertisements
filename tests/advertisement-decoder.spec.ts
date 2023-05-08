import { Advertisement, AdvertisementDecoder, GapAttributeCode, PluginAdvertisement } from '../src';
import { AdvertisementBufferBuilder } from './utility/advertisement-buffer-builder';

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

	it('properly handles complex configurations', () => {
		
		const decoder = new AdvertisementDecoder();

		const partialAdvertisingData: PluginAdvertisement = {
			id: '00:11:22:33:44:55',
			name: 'Test Device',
			rssi: -45,
			advertising: null as any
		};

		const decoded = decoder.decode(partialAdvertisingData, {});

		expect(decoded).toEqual({} as any);
	});

	it('has an option to resolve either local shorted name or local complete name when both exist', () => {

		const decoder = new AdvertisementDecoder({useShortenedLocalName: true});
		const textEncoder = new TextEncoder();
		const shortNameText = 'Short Name';
		const completeNameText = 'Complete Name';

		const advertising = new AdvertisementBufferBuilder()
			.add(GapAttributeCode.LOCAL_NAME_SHORTENED, textEncoder.encode(shortNameText))
			.add(GapAttributeCode.LOCAL_NAME_COMPLETE, textEncoder.encode(completeNameText))
			.toUint8Array()
			.buffer;

		const decoded = decoder.decode(advertising);
		expect(decoded.advDataLocalName).toBe(shortNameText);
	});

	it('includes channel, tx power level, and manufacturer data when provided', () => {

		const decoder = new AdvertisementDecoder();
		const channel = 15;
		const txPowerLevel = 45;
		const manufacturerDataBuffer = Uint8Array.of(1, 2, 3, 4, 5);

		const advertising = new AdvertisementBufferBuilder()
			.add(GapAttributeCode.CHANNEL_MAP_UPDATE_INDICATION, Uint8Array.of(channel))
			.add(GapAttributeCode.TX_POWER_LEVEL, Uint8Array.of(txPowerLevel))
			.add(GapAttributeCode.MANUFACTURER_SPECIFIC_DATA, manufacturerDataBuffer)
			.toUint8Array()
			.buffer;

		const decoded = decoder.decode(advertising);

		expect(decoded.advDataChannel).toBe(channel);
		expect(decoded.advDataTxPowerLevel).toBe(txPowerLevel);
		expect(decoded.advDataManufacturerData).toEqual(manufacturerDataBuffer);
	});
});