import { iOSAdvertisingData } from './ios-advertising-data';

/**
 * Core type of data to expect on the 'advertising' property.
 * Android will give a type of buffer value, where iOS will give a property map.
 */
export type PluginAdvertisingData = ArrayBuffer | ArrayBufferLike | iOSAdvertisingData;

/**
 * Advertisement packet received from one of the scan callbacks.
 */
export interface PluginAdvertisement {
	id: string;
	name: string;
	rssi: number;
	advertising: PluginAdvertisingData;
}
