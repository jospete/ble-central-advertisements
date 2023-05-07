# ble-central-advertisements

Advertisement parsing utility for [cordova-plugin-ble-central](https://github.com/don/cordova-plugin-ble-central).

This module aims to unify core GATT advertising attributes under a single interface,
so that we can spend less time parsing mundane Bluetooth GATT / ATT profile specifics and more
time making bluetooth apps.

## Installation

install from npm via:

```
npm install -P -E ble-central-advertisements
```

## Usage

```typescript
import { AdvertisementDecoder } from 'ble-central-advertisements';

const decoder = new AdvertisementDecoder();
const services = [];
const seconds = 30;

function success(advertisement) {

	let parsed = decoder.decode(advertisement);

	// or if you want to leave the advertisement un-mutated
	// let parsed = decoder.decode(advertisement, {});

	console.log(parsed.advDataLocalName);
}

function failure(error) {
	console.log(error);
}

// https://github.com/don/cordova-plugin-ble-central#scan
ble.scan(services, seconds, success, failure);
```

**NOTE:** While this module was primarily built to deal with advertising data from the ble-central plugin,
it is designed to be general purpose, and can parse raw BLE advertising data provided from any module / plugin
(not just from the ble-central plugin).

```typescript
import { AdvertisementDecoder, Convert } from 'ble-central-advertisements';

const decoder = new AdvertisementDecoder();
const advertisementDataHex = '020106030309181409546865726d6f6d65746572204578616d706c65';
const input = Convert.hexToUint8Array(advertisementDataHex).buffer;
const output = decoder.decode(input);

console.log(output.advDataLocalName); // 'Thermometer Example'
```

## Documentation

Source documentation can be found [here](https://jospete.github.io/ble-central-advertisements/)