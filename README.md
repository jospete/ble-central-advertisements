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
import { AdvertisementDecoder } from 'ble-central-advertising';

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

## Documentation

Source documentation can be found [here](https://jospete.github.io/ble-central-advertisements/)