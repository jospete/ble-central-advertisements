import { isObject } from '../common/utility';
import { PluginAdvertisement } from '../plugin/plugin-advertisement';

export interface Advertisement extends PluginAdvertisement {
}

export function parseAdvertisement(pluginAdvertisement: PluginAdvertisement): Advertisement {

	const result = pluginAdvertisement as Advertisement;

    if (isObject(pluginAdvertisement)) {
	}

	return result;
}