import { Utility } from '../common/utility';
import { Convert } from '../common/convert';
import { GapAdvertisementFlagType, isGapAdvertisementFlagRaised } from '../gap/gap-advertisement-flag-type';
import { GapAttributesMetadata, parseGapAttributesMetadata } from '../gap/gap-attributes-metadata';
import { iOSAdvertisingData, iOSAdvertisingServiceDataDictionary, isIOSAdvertisingData } from '../plugin/ios-advertising-data';
import { PluginAdvertisement } from '../plugin/plugin-advertisement';
import { parseAdvertisementManufacturerMetadata } from '../gap/gap-manufacturer-data';

const { isObject, isArrayBuffer, isUint8Array } = Utility;

export interface AdvertisingServiceDataDictionary extends iOSAdvertisingServiceDataDictionary {
}

/**
 * Shares common fields between android and ios payloads,
 * and masks platform-specific fields as generalized ones.
 */
export interface Advertisement extends PluginAdvertisement {
	/**
	 * Raw GAP dictionary result - only available when the decoded
	 * advertisement provides a raw ArrayBuffer instance.
	 */
	gap?: GapAttributesMetadata;

	/**
	 * Value of `GapAttributeCode.FLAGS` - only available when the decoded
	 * advertisement provides a raw ArrayBuffer instance.
	 */
	gapFlags?: number;

	/**
	 * The channel that this BLE peripheral is advertising on.
	 * https://www.rfwireless-world.com/Terminology/BLE-Advertising-channels-and-Data-channels-list.html
	 */
	advDataChannel?: number;

	/**
	 * An alternate name for this BLE peripheral.
	 * This will be the short name or the complete name, depending on decoder options.
	 */
	advDataLocalName?: string;

	/**
	 * Indication of expected signal power for the BLE peripheral.
	 * https://www.bluetooth.com/specifications/specs/tx-power-service-1-0/
	 */
	advDataTxPowerLevel?: number;

	/**
	 * Whether the BLE peripheral is advertising as connectable.
	 * When this is false, the peripherl is in "limited discovery" or "discovery only" mode.
	 */
	advDataIsConnectable?: boolean;

	/**
	 * Any 16-bit service UUIDs included in the advertisement payload.
	 */
	advDataServiceUUIDs?: string[];

	/**
	 * Any service-specific data the BLE peripheral chooses to provide.
	 */
	advDataServiceData?: AdvertisingServiceDataDictionary;

	/**
	 * Block of data provided by the vendor of the BLE peripheral, which
	 * includes both a 16-bit UUID of the manufacturer (first 2 bytes) and a custom
	 * manufacturer-specific payload (remaining N bytes of manufacturer data segment).
	 */
	advDataManufacturerData?: ArrayBuffer;

	/**
	 * The manufacturer ID parsed from the BLE peripheral advertisement.
	 * Will only be provided if the payload contains manufacturer data.
	 */
	advDataManufacturerId?: number;

	/**
	 * The manufacturer data (modulo the manufacturer ID) parsed from the BLE peripheral advertisement.
	 * Will only be provided if the payload contains manufacturer data.
	 */
	advDataManufacturerPayload?: Uint8Array;
}

/**
 * Customization options for decoder instances.
 */
export interface AdvertisementDecoderOptions {
	/**
	 * When true, will instruct the decoder to assign
	 * the parsed short name to `advDataLocalName`.
	 * Otherwise, the complete (long) name will be assigned.
	 */
	useShortenedLocalName?: boolean;

	/**
	 * When true, will instruct the decoder to
	 * also parse the manufacturer data segment if it is available.
	 */
	includeManufacturerMetadata?: boolean;

	/**
	 * Allow for custom options used by sub-classes.
	 */
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
		target.advDataManufacturerData = gap.manufacturerSpecificData!.buffer;
}

/**
 * Generalized decoder that does boilerplate advertising data checks / parsing
 * based on the type of the advertising data recieved.
 * 
 * This can be sub-classed to further customize the decode functionality.
 */
export class AdvertisementDecoder {

	constructor(
		private readonly options: AdvertisementDecoderOptions = {
			includeManufacturerMetadata: true
		}
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

		if (this.options.includeManufacturerMetadata && isArrayBuffer(result.advDataManufacturerData)) {
			const parsedMfrData = parseAdvertisementManufacturerMetadata(new Uint8Array(result.advDataManufacturerData!));
			const { manufacturerId, manufacturerData } = parsedMfrData;
			result.advDataManufacturerId = manufacturerId;
			result.advDataManufacturerPayload = manufacturerData;
		}

		return result;
	}
}