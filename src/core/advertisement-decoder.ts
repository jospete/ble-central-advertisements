import { Utility } from '../common/utility';
import { Convert } from '../common/convert';
import { GapAdvertisementFlagType, isGapAdvertisementFlagRaised } from '../gap/gap-advertisement-flag-type';
import { GapAttributesMetadata, parseGapAttributesMetadata } from '../gap/gap-attributes-metadata';
import { iOSAdvertisingData, iOSAdvertisingServiceDataDictionary, isIOSAdvertisingData } from '../plugin/ios-advertising-data';
import { PluginAdvertisement } from '../plugin/plugin-advertisement';

const { isObject, isArrayBuffer, isUint8Array } = Utility;

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

	const localNameBuffer = options.useShortenedLocalName
		? gap.localNameShortened
		: gap.localNameComplete;

	target.gap = gap;
	target.advDataLocalName = Convert.uint8ArrayToUTF8(localNameBuffer!);
	target.advDataServiceUUIDs = Convert.uint8ArrayTo16BitServiceUuids(gap.completeListOfServiceUuids16Bit!);

	if (isUint8Array(gap.flags)) {
		const flags = target.gapFlags = gap.flags![0];
		target.advDataIsConnectable = isGapAdvertisementFlagRaised(flags, GapAdvertisementFlagType.LE_GENERAL_DISC_MODE);
	}

	if (isUint8Array(gap.channelMapUpdateIndication))
		target.advDataChannel = gap.channelMapUpdateIndication![0];

	if (isUint8Array(gap.txPowerLevel))
		target.advDataTxPowerLevel = gap.txPowerLevel![0];

	if (isUint8Array(gap.manufacturerSpecificData))
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
	 * input value, and that value will be returned.
	 * 
	 * NOTE: if the input is an ArrayBuffer, this will generate a new
	 * object as the output rather than hammering properties onto
	 * the ArrayBuffer instance.
	 */
	public decode(
		input: PluginAdvertisement | Partial<PluginAdvertisement> | ArrayBuffer,
		output?: Partial<Advertisement>
	): Advertisement | Partial<Advertisement> {

		let result = isObject(output)
			? output as Advertisement
			: input as Advertisement;

		// nothing to process, abort
		if (!isObject(input))
			return result;

		const isBufferSource = isArrayBuffer(input);

		// don't allow shimming properties onto buffer sources
		if (result === input && isBufferSource)
			result = {} as Advertisement;

		const advertising = isBufferSource
			? input
			: (input as Advertisement).advertising;

		if (isArrayBuffer(advertising)) {
			const buffer = new Uint8Array(advertising as ArrayBuffer);
			const gap = parseGapAttributesMetadata(buffer);
			populateAdvertisementFromGap(result, gap, this.options);

		} else if (isIOSAdvertisingData(advertising)) {
			cloneIOSAdvertisingData(result, advertising as iOSAdvertisingData);
		}

		return result;
	}
}