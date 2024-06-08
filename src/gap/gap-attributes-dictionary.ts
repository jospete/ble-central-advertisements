import { Utility } from '../common/utility';

const { isInteger, isUint8Array } = Utility;

/**
 * Result returned by parseGapAttributesDictionary()
 */
export interface GapAttributesDictionary {
	[key: number]: Uint8Array;
}

/**
 * Constructs an object map of the available types in the given bytes array.
 * The bluetooth advertisement sequence is Length-Tag-Value, as in:
 * 1-byte length, 1-byte type, (length - 1) bytes of data.
 *
 * More info:
 * https://www.bluetooth.com/specifications/assigned-numbers/generic-access-profile
 * https://stackoverflow.com/questions/24003777/read-advertisement-packet-in-android
 */
export function parseGapAttributesDictionary(buffer: Uint8Array): GapAttributesDictionary {
	const result: GapAttributesDictionary = {};

	if (!isUint8Array(buffer)) {
		return result;
	}

	let i: number = 0;
	let len: number;
	let type: number;
	let dataStart: number;
	let dataEnd: number;

	while (i < buffer.byteLength) {

		// length byte comes first in packet structure
		len = buffer[i];

		// terminate when length byte is zero or not an integer value
		if (!isInteger(len) || len <= 0) {
			break;
		}

		type = buffer[i + 1]; // type byte is after length
		dataStart = i + 2; // Skip length and tag bytes to get data start index
		dataEnd = dataStart + len - 1; // "length" byte includes type, so back up by 1

		// Capture payload for given type with the key as the raw byte literal of the type, i.e. 0xff
		result[type] = buffer.slice(dataStart, dataEnd);

		// Advance to start of next chunk
		i = dataEnd;
	}

	return result;
}
