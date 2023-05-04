import {isObject} from '../common/utility';

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
	kCBAdvDataChannel?: number;
	kCBAdvDataLocalName?: string;
	kCBAdvDataTxPowerLevel?: number;
	kCBAdvDataIsConnectable?: boolean;
	kCBAdvDataServiceUUIDs?: string[];
	kCBAdvDataManufacturerData?: ArrayBuffer;
	kCBAdvDataServiceData?: iOSAdvertisingServiceDataDictionary;
}

export type iOSAdvertisingDataKey = keyof iOSAdvertisingData;

/**
 * Get the list of enumerated properties for an iOS advertising data object.
 */
export function getIOSAdvertisingDataKeys(): iOSAdvertisingDataKey[] {
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
export const isIOSAdvertisingData = (value: any): boolean => {

	if (!isObject(value)) {
		return false;
	}

	for (const key of getIOSAdvertisingDataKeys()) {
		if (key in value) {
			return true;
		}
	}

	return false;
};
