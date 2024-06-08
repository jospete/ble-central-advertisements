export class AdvertisementBufferBuilder {
	public bytes: number[] = [];

	add(tag: number, buffer: Uint8Array): this {
		this.bytes.push(buffer.byteLength + 1, tag, ...Array.from(buffer));
		return this;
	}

	toUint8Array(): Uint8Array {
		return Uint8Array.from(this.bytes);
	}
}