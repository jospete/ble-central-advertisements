import { iOSAdvertisingData } from './ios-advertising-data';

/**
 * Core type of data to expect on the 'advertising' property.
 * Android will give a type of buffer value, where iOS will give a property map.
 */
export type PluginAdvertisingData = ArrayBuffer | ArrayBufferLike | iOSAdvertisingData;

/**
 * Advertisement packet received from one of the scan callbacks of cordova-plugin-ble-central.
 */
export interface PluginAdvertisement {

	/**
	 * Unique identifier of the BLE peripheral which produced this advertisement
	 */
	id: string;

	/**
	 * Human-readable name of the BLE peripheral, which corresponds to
	 * `GapAttributeCode.LOCAL_NAME_COMPLETE`
	 */
	name: string;

	/**
	 * The detected signal quality between our central and the BLE peripheral
	 * https://www.bluetooth.com/blog/proximity-and-rssi/
	 */
	rssi: number;

	/**
	 * Advertising payload reported by the cordova plugin.
	 * On Android, this will be the full advertisement as a raw ArrayBuffer.
	 * On iOS, this will be a preprocessed dictionary GAP attributes.
	 */
	advertising: PluginAdvertisingData;
}
