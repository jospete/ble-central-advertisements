import { Utility } from '../common/utility';

const { isObject } = Utility;

/**
 * Partial interface for iOS 'advertising' property.
 */
export interface iOSAdvertisingServiceDataDictionary {
	[uuid: string]: ArrayBuffer;
}

/**
 * Core object attributes iOS 'advertising' property.
 */
export interface iOSAdvertisingData {
	/**
	 * Corresponds to `GapAttributeCode.CHANNEL_MAP_UPDATE_INDICATION`
	 */
	kCBAdvDataChannel?: number;

	/**
	 * Corresponds to `GapAttributeCode.LOCAL_NAME_SHORTENED`
	 */
	kCBAdvDataLocalName?: string;

	/**
	 * Corresponds to `GapAttributeCode.TX_POWER_LEVEL`
	 */
	kCBAdvDataTxPowerLevel?: number;

	/**
	 * Corresponds to `GapAttributeCode.FLAGS`
	 */
	kCBAdvDataIsConnectable?: boolean;

	/**
	 * Corresponds to `GapAttributeCode.COMPLETE_LIST_OF_SERVICE_UUIDS_16_BIT`
	 */
	kCBAdvDataServiceUUIDs?: string[];

	/**
	 * Corresponds to `GapAttributeCode.MANUFACTURER_SPECIFIC_DATA`
	 */
	kCBAdvDataManufacturerData?: ArrayBuffer;

	/**
	 * Corresponds to one of:
	 * - `GapAttributeCode.SERVICE_DATA_UUID_16_BIT`
	 * - `GapAttributeCode.SERVICE_DATA_UUID_32_BIT`
	 * - `GapAttributeCode.SERVICE_DATA_UUID_128_BIT`
	 */
	kCBAdvDataServiceData?: iOSAdvertisingServiceDataDictionary;
}

export type iOSAdvertisingDataKey = keyof iOSAdvertisingData;

/**
 * Get the list of enumerated properties for an iOS advertising data object.
 */
function getIOSAdvertisingDataKeys(): iOSAdvertisingDataKey[] {
	return [
		'kCBAdvDataChannel',
		'kCBAdvDataLocalName',
		'kCBAdvDataTxPowerLevel',
		'kCBAdvDataIsConnectable',
		'kCBAdvDataServiceUUIDs',
		'kCBAdvDataManufacturerData',
		'kCBAdvDataServiceData'
	];
}

/**
 * Utility for testing the validity of a given value as an iOS advertisement dictionary.
 */
export function isIOSAdvertisingData(value: any): boolean {
	if (!isObject(value)) {
		return false;
	}

	for (const key of getIOSAdvertisingDataKeys()) {
		if (key in value) {
			return true;
		}
	}

	return false;
}
