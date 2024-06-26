import { AdvertisementDecoder, Convert } from '../src';

describe('ble-central-advertisements', () => {
	describe('AdvertisementDecoder', () => {
		it('decodes advertisements based on a combination of the bluetooth spec and the ble central plugin spec', () => {
			/*
			https://community.silabs.com/s/article/kba-bt-0201-bluetooth-advertising-data-basics?language=en_US

			Raw advertising data (28 bytes)
			020106030309181409546865726d6f6d65746572204578616d706c65
			Same data split into AD elements:
			020106
			03030918
			1409546865726d6f6d65746572204578616d706c65,
			Length
			-> type = 0x01 = flags, value = 0x06 = b'00000110
			-> type = 0x03 = list of 16-bit services, value =
			0x1809 (Health Thermometer)
			AD Type
			Type = 0x09 = complete local name
			Value: " Thermometer Example"
			*/

			const decoder = new AdvertisementDecoder();

			const advertisementDataHex = '020106030309181409546865726d6f6d65746572204578616d706c65';
			const advertising = Convert.hexToUint8Array(advertisementDataHex).buffer;
			const output = decoder.decode({ id: '00:11:22:33:44:55', name: 'Thermometer', rssi: -50, advertising });

			expect(output.gap).toBeDefined();
			expect(output.gapFlags).toBe(0x06);
			expect(output.advDataLocalName).toBe('Thermometer Example');
			expect(output.gap?.completeListOfServiceUuids16Bit).toEqual(Uint8Array.from([0x09, 0x18]));
			expect(output.advDataServiceUUIDs).toEqual(['1809']);
		});

		it('can run the readme example', () => {
			const decoder = new AdvertisementDecoder();
			const advertisementDataHex = '020106030309181409546865726d6f6d65746572204578616d706c65';
			const input = Convert.hexToUint8Array(advertisementDataHex).buffer;
			const output = decoder.decode(input);

			expect(output.advDataLocalName).toBe('Thermometer Example');
			expect(output).not.toBe(input as any);
		})
	});
});