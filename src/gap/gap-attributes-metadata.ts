import { isUndefined } from '../common/utility';
import { GapAttributeCode } from './gap-attribute-code';
import { GapAttributesDictionary, parseGapAttributesDictionary } from './gap-attributes-dictionary';

export type GapAttributeValue = Uint8Array;

/**
 * Core set of TLV options for advertising data
 * per the bluetooth spec.
 */
export interface GapAttributesMetadata {
	flags?: GapAttributeValue;
	incompleteListOfServiceUuids16Bit?: GapAttributeValue;
	completeListOfServiceUuids16Bit?: GapAttributeValue;
	incompleteListOfServiceUuids32Bit?: GapAttributeValue;
	completeListOfServiceUuids32Bit?: GapAttributeValue;
	incompleteListOfServiceUuids128Bit?: GapAttributeValue;
	completeListOfServiceUuids128Bit?: GapAttributeValue;
	localNameShortened?: GapAttributeValue;
	localNameComplete?: GapAttributeValue;
	txPowerLevel?: GapAttributeValue;
	deviceClass?: GapAttributeValue;
	simplePairingHashC192?: GapAttributeValue;
	simplePairingRandomizerR192?: GapAttributeValue;
	deviceId?: GapAttributeValue;
	securityManagerOutOfBandFlags?: GapAttributeValue;
	slaveConnectionIntervalRange?: GapAttributeValue;
	listOfServiceSolicitationUuids16Bit?: GapAttributeValue;
	listOfServiceSolicitationUuids128Bit?: GapAttributeValue;
	serviceDataUuid16Bit?: GapAttributeValue;
	targetAddressPublic?: GapAttributeValue;
	targetAddressRandom?: GapAttributeValue;
	appearance?: GapAttributeValue;
	advertisingInterval?: GapAttributeValue;
	leBluetoothDeviceAddress?: GapAttributeValue;
	leRole?: GapAttributeValue;
	simplePairingHashC256?: GapAttributeValue;
	simplePairingRandomizerR256?: GapAttributeValue;
	listOfServiceSolicitationUuids32Bit?: GapAttributeValue;
	serviceDataUuid32Bit?: GapAttributeValue;
	serviceDataUuid128Bit?: GapAttributeValue;
	leSecureConnectionsConfirmationValue?: GapAttributeValue;
	leSecureConnectionsRandomValue?: GapAttributeValue;
	uri?: GapAttributeValue;
	indoorPositioning?: GapAttributeValue;
	transportDiscoveryData?: GapAttributeValue;
	leSupportedFeatures?: GapAttributeValue;
	channelMapUpdateIndication?: GapAttributeValue;
	pbAdv?: GapAttributeValue;
	meshMessage?: GapAttributeValue;
	meshBeacon?: GapAttributeValue;
	bigInfo?: GapAttributeValue;
	broadcastCode?: GapAttributeValue;
	informationData3D?: GapAttributeValue;
	manufacturerSpecificData?: GapAttributeValue;
	[key: string]: GapAttributeValue | undefined;
}

/**
 * Parses the given raw advertising data as a metadata object with all TLV fields
 * processed / converted into named fields.
 */
export function parseGapAttributesMetadata(buffer: Uint8Array): GapAttributesMetadata {

	const result = parseGapAttributesMetadataFromDictionary(parseGapAttributesDictionary(buffer));

	// purge undefined keys from the output
	for (const key in result) {
		if (isUndefined(result[key])) {
			delete result[key];
		}
	}

	return result;
};

/**
 * Transforms a raw dictionary of parsed gap attributes into a strongly typed object.
 */
export function parseGapAttributesMetadataFromDictionary(table: GapAttributesDictionary): GapAttributesMetadata {
	return {
		flags: table[GapAttributeCode.FLAGS],
		incompleteListOfServiceUuids16Bit: table[GapAttributeCode.INCOMPLETE_LIST_OF_SERVICE_UUIDS_16_BIT],
		completeListOfServiceUuids16Bit: table[GapAttributeCode.COMPLETE_LIST_OF_SERVICE_UUIDS_16_BIT],
		incompleteListOfServiceUuids32Bit: table[GapAttributeCode.INCOMPLETE_LIST_OF_SERVICE_UUIDS_32_BIT],
		completeListOfServiceUuids32Bit: table[GapAttributeCode.COMPLETE_LIST_OF_SERVICE_UUIDS_32_BIT],
		incompleteListOfServiceUuids128Bit: table[GapAttributeCode.INCOMPLETE_LIST_OF_SERVICE_UUIDS_128_BIT],
		completeListOfServiceUuids128Bit: table[GapAttributeCode.COMPLETE_LIST_OF_SERVICE_UUIDS_128_BIT],
		localNameShortened: table[GapAttributeCode.LOCAL_NAME_SHORTENED],
		localNameComplete: table[GapAttributeCode.LOCAL_NAME_COMPLETE],
		txPowerLevel: table[GapAttributeCode.TX_POWER_LEVEL],
		deviceClass: table[GapAttributeCode.DEVICE_CLASS],
		simplePairingHashC192: table[GapAttributeCode.SIMPLE_PAIRING_HASH_C_192],
		simplePairingRandomizerR192: table[GapAttributeCode.SIMPLE_PAIRING_RANDOMIZER_R_192],
		deviceId: table[GapAttributeCode.DEVICE_ID],
		securityManagerOutOfBandFlags: table[GapAttributeCode.SECURITY_MANAGER_OUT_OF_BAND_FLAGS],
		slaveConnectionIntervalRange: table[GapAttributeCode.SLAVE_CONNECTION_INTERVAL_RANGE],
		listOfServiceSolicitationUuids16Bit: table[GapAttributeCode.LIST_OF_SERVICE_SOLICITATION_UUIDS_16_BIT],
		listOfServiceSolicitationUuids128Bit: table[GapAttributeCode.LIST_OF_SERVICE_SOLICITATION_UUIDS_128_BIT],
		serviceDataUuid16Bit: table[GapAttributeCode.SERVICE_DATA_UUID_16_BIT],
		targetAddressPublic: table[GapAttributeCode.TARGET_ADDRESS_PUBLIC],
		targetAddressRandom: table[GapAttributeCode.TARGET_ADDRESS_RANDOM],
		appearance: table[GapAttributeCode.APPEARANCE],
		advertisingInterval: table[GapAttributeCode.ADVERTISING_INTERVAL],
		leBluetoothDeviceAddress: table[GapAttributeCode.LE_BLUETOOTH_DEVICE_ADDRESS],
		leRole: table[GapAttributeCode.LE_ROLE],
		simplePairingHashC256: table[GapAttributeCode.SIMPLE_PAIRING_HASH_C_256],
		simplePairingRandomizerR256: table[GapAttributeCode.SIMPLE_PAIRING_RANDOMIZER_R_256],
		listOfServiceSolicitationUuids32Bit: table[GapAttributeCode.LIST_OF_SERVICE_SOLICITATION_UUIDS_32_BIT],
		serviceDataUuid32Bit: table[GapAttributeCode.SERVICE_DATA_UUID_32_BIT],
		serviceDataUuid128Bit: table[GapAttributeCode.SERVICE_DATA_UUID_128_BIT],
		leSecureConnectionsConfirmationValue: table[GapAttributeCode.LE_SECURE_CONNECTIONS_CONFIRMATION_VALUE],
		leSecureConnectionsRandomValue: table[GapAttributeCode.LE_SECURE_CONNECTIONS_RANDOM_VALUE],
		uri: table[GapAttributeCode.URI],
		indoorPositioning: table[GapAttributeCode.INDOOR_POSITIONING],
		transportDiscoveryData: table[GapAttributeCode.TRANSPORT_DISCOVERY_DATA],
		leSupportedFeatures: table[GapAttributeCode.LE_SUPPORTED_FEATURES],
		channelMapUpdateIndication: table[GapAttributeCode.CHANNEL_MAP_UPDATE_INDICATION],
		pbAdv: table[GapAttributeCode.PB_ADV],
		meshMessage: table[GapAttributeCode.MESH_MESSAGE],
		meshBeacon: table[GapAttributeCode.MESH_BEACON],
		bigInfo: table[GapAttributeCode.BIG_INFO],
		broadcastCode: table[GapAttributeCode.BROADCAST_CODE],
		informationData3D: table[GapAttributeCode.INFORMATION_DATA_3D],
		manufacturerSpecificData: table[GapAttributeCode.MANUFACTURER_SPECIFIC_DATA],
	};
};
