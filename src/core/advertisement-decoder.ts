import { isObject, parse16BitServiceUuids, parseAsciiString } from '../common/utility';
import { GapAdvertisementFlagType, isGapAdvertisementFlagRaised } from '../gap/gap-advertisement-flag-type';
import { GapAttributesMetadata, parseGapAttributesMetadata } from '../gap/gap-attributes-metadata';
import { iOSAdvertisingData, iOSAdvertisingServiceDataDictionary, isIOSAdvertisingData } from '../plugin/ios-advertising-data';
import { PluginAdvertisement } from '../plugin/plugin-advertisement';

export interface AdvertisingServiceDataDictionary extends iOSAdvertisingServiceDataDictionary {
}

/**
 * Shares common fields between android and ios payloads,
 * and masks platform-specific fields as generalized ones.
 */
export interface Advertisement extends PluginAdvertisement {
	gap?: GapAttributesMetadata;
	gapFlags?: number;
	advDataChannel?: number;
	advDataLocalName?: string;
	advDataTxPowerLevel?: number;
	advDataIsConnectable?: boolean;
	advDataServiceUUIDs?: string[];
	advDataManufacturerData?: ArrayBuffer;
	advDataServiceData?: AdvertisingServiceDataDictionary;
}

/**
 * Customization options for decoder instances.
 */
export interface AdvertisementDecoderOptions {
	useShortenedLocalName?: boolean;
	[key: string]: any;
}

/**
 * Generalized decoder that does boilerplate advertising data checks / parsing
 * based on the type of the advertising data recieved.
 * 
 * This can be sub-classed to further customize the decode functionality.
 */
export class AdvertisementDecoder {

	constructor(
		private readonly options: AdvertisementDecoderOptions = {}
	) {
	}

	/**
	 * Decode an advertisement payload received from the ble central plugin.
	 * If an output value is provided, all parsed content will be placed on
	 * it - otherwise, parsed content will be shimmed into the provided
	 * advertisement packet.
	 */
	public decode(
		source: PluginAdvertisement,
		output: Partial<Advertisement> | null = null
	): Advertisement {

		const result = isObject(output)
		? output as Advertisement
		: source as Advertisement;

		if (isObject(source)) {

			const {advertising} = source;

			if (isIOSAdvertisingData(advertising)) {

				const adv = advertising as iOSAdvertisingData;

				result.advDataChannel = adv.kCBAdvDataChannel;
				result.advDataLocalName = adv.kCBAdvDataLocalName;
				result.advDataTxPowerLevel = adv.kCBAdvDataTxPowerLevel;
				result.advDataIsConnectable = adv.kCBAdvDataIsConnectable;
				result.advDataServiceUUIDs = adv.kCBAdvDataServiceUUIDs;
				result.advDataManufacturerData = adv.kCBAdvDataManufacturerData;
				result.advDataServiceData = adv.kCBAdvDataServiceData;
				
			} else if (advertising instanceof ArrayBuffer) {
				
				const adv = advertising as ArrayBuffer;
				const gap = parseGapAttributesMetadata(new Uint8Array(adv));
				const gapFlags = gap.flags ? gap.flags[0] : 0;
				const localNameBuffer = this.options.useShortenedLocalName
					? gap.localNameShortened
					: gap.localNameComplete;

				result.gap = gap;
				result.gapFlags = gapFlags;
				result.advDataLocalName = parseAsciiString(localNameBuffer!);
				result.advDataTxPowerLevel = gap.txPowerLevel ? gap.txPowerLevel[0] : 0;
				result.advDataIsConnectable = isGapAdvertisementFlagRaised(gapFlags, GapAdvertisementFlagType.LE_GENERAL_DISC_MODE);
				result.advDataServiceUUIDs = parse16BitServiceUuids(gap.serviceDataUuid16Bit!);
			}
		}

		return result;
	}
}