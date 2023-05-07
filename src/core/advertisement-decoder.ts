import { isInteger, isObject, isUint8Array } from '../common/utility';
import { uint8ArrayToUTF8, uint8ArrayTo16BitServiceUuids } from '../common/convert';
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

function cloneIOSAdvertisingData(
	target: Partial<Advertisement>,
	adv: iOSAdvertisingData
): void {

	if (!isObject(target) || !isObject(adv))
		return;

	target.advDataChannel = adv.kCBAdvDataChannel;
	target.advDataLocalName = adv.kCBAdvDataLocalName;
	target.advDataTxPowerLevel = adv.kCBAdvDataTxPowerLevel;
	target.advDataIsConnectable = adv.kCBAdvDataIsConnectable;
	target.advDataServiceUUIDs = adv.kCBAdvDataServiceUUIDs;
	target.advDataManufacturerData = adv.kCBAdvDataManufacturerData;
	target.advDataServiceData = adv.kCBAdvDataServiceData;
}

function populateAdvertisementFromGap(
	target: Partial<Advertisement>,
	gap: GapAttributesMetadata,
	options: AdvertisementDecoderOptions
): void {

	if (!isObject(target) || !isObject(gap))
		return;

	const gapFlags = gap.flags ? gap.flags[0] : undefined;
	const localNameBuffer = options.useShortenedLocalName
		? gap.localNameShortened
		: gap.localNameComplete;

	target.gap = gap;
	target.gapFlags = gapFlags;

	if (isUint8Array(gap.channelMapUpdateIndication))
		target.advDataChannel = gap.channelMapUpdateIndication![0];

	target.advDataLocalName = uint8ArrayToUTF8(localNameBuffer!);

	if (isUint8Array(gap.txPowerLevel))
		target.advDataTxPowerLevel = gap.txPowerLevel![0];

	if (isInteger(gapFlags))
		target.advDataIsConnectable = isGapAdvertisementFlagRaised(gapFlags!, GapAdvertisementFlagType.LE_GENERAL_DISC_MODE);

	target.advDataServiceUUIDs = uint8ArrayTo16BitServiceUuids(gap.completeListOfServiceUuids16Bit!);
	target.advDataManufacturerData = gap.manufacturerSpecificData;
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
		source: PluginAdvertisement | Partial<PluginAdvertisement>,
		output?: Partial<Advertisement>
	): Advertisement {

		const result = isObject(output)
			? output as Advertisement
			: source as Advertisement;

		if (!isObject(source))
			return result;

		const { advertising } = source;

		if (isIOSAdvertisingData(advertising)) {
			const adv = advertising as iOSAdvertisingData;
			cloneIOSAdvertisingData(result, adv);

		} else if (advertising instanceof ArrayBuffer) {
			const adv = advertising as ArrayBuffer;
			const gap = parseGapAttributesMetadata(new Uint8Array(adv));
			populateAdvertisementFromGap(result, gap, this.options);
		}

		return result;
	}
}