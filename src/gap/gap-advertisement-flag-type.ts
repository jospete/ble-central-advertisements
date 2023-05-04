// Options stolen from nordic code
// /**@defgroup BLE_GAP_ADV_FLAGS GAP Advertisement Flags
//  * @{ */
// #define BLE_GAP_ADV_FLAG_LE_LIMITED_DISC_MODE         (0x01)   /**< LE Limited Discoverable Mode. */
// #define BLE_GAP_ADV_FLAG_LE_GENERAL_DISC_MODE         (0x02)   /**< LE General Discoverable Mode. */
// #define BLE_GAP_ADV_FLAG_BR_EDR_NOT_SUPPORTED         (0x04)   /**< BR/EDR not supported. */
// #define BLE_GAP_ADV_FLAG_LE_BR_EDR_CONTROLLER         (0x08)   /**< Simultaneous LE and BR/EDR, Controller. */
// #define BLE_GAP_ADV_FLAG_LE_BR_EDR_HOST               (0x10)   /**< Simultaneous LE and BR/EDR, Host. */
// #define BLE_GAP_ADV_FLAGS_LE_ONLY_LIMITED_DISC_MODE   (BLE_GAP_ADV_FLAG_LE_LIMITED_DISC_MODE | BLE_GAP_ADV_FLAG_BR_EDR_NOT_SUPPORTED)   /**< LE Limited Discoverable Mode, BR/EDR not supported. */
// #define BLE_GAP_ADV_FLAGS_LE_ONLY_GENERAL_DISC_MODE   (BLE_GAP_ADV_FLAG_LE_GENERAL_DISC_MODE | BLE_GAP_ADV_FLAG_BR_EDR_NOT_SUPPORTED)   /**< LE General Discoverable Mode, BR/EDR not supported. */
// /**@} */
export enum GapAdvertisementFlagType {
	LE_LIMITED_DISC_MODE = 0x01,
	LE_GENERAL_DISC_MODE = 0x02,
	BR_EDR_NOT_SUPPORTED = 0x04,
	LE_BR_EDR_CONTROLLER = 0x08,
	LE_BR_EDR_HOST = 0x10,
	LE_ONLY_LIMITED_DISC_MODE = 0x05,
	LE_ONLY_GENERAL_DISC_MODE = 0x06
}

export function isGapAdvertisementFlagRaised(flags: number, type: GapAdvertisementFlagType): boolean {
	return ((flags & type) >>> 0) === type;
};
