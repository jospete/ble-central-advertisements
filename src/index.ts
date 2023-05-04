export * as Convert from './common/convert';
export {Advertisement, AdvertisementDecoderOptions, AdvertisingServiceDataDictionary, AdvertisementDecoder} from './core/advertisement-decoder';
export {GapAdvertisementFlagType, isGapAdvertisementFlagRaised} from './gap/gap-advertisement-flag-type';
export {GapAttributeCode} from './gap/gap-attribute-code';
export {GapAttributesDictionary, parseGapAttributesDictionary} from './gap/gap-attributes-dictionary';
export {GapAttributeValue, GapAttributesMetadata, parseGapAttributesMetadata, parseGapAttributesMetadataFromDictionary} from './gap/gap-attributes-metadata';
export {GapManufacturerData, parseAdvertisementManufacturerMetadata} from './gap/gap-manufacturer-data';
export {iOSAdvertisingData, iOSAdvertisingDataKey, iOSAdvertisingServiceDataDictionary, isIOSAdvertisingData} from './plugin/ios-advertising-data';
export {PluginAdvertisement, PluginAdvertisingData} from './plugin/plugin-advertisement';