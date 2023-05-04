export interface GapManufacturerData {
	manufacturerId: number;
	manufacturerData: Uint8Array;
}

/**
 * https://www.bluetooth.com/specifications/assigned-numbers/company-identifiers/
 */
export function parseAdvertisementManufacturerMetadata(
	input: Uint8Array
): GapManufacturerData {

	let manufacturerId: number = 0;
	let manufacturerData: Uint8Array = input;

	if ((input instanceof Uint8Array) && input.byteLength >= 2) {
		manufacturerId = new DataView(input.buffer).getUint16(0, true);
		manufacturerData = input.slice(2);
	}

	return {manufacturerId, manufacturerData};
};