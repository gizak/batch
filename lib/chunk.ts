import {JobCtx} from './job-context'
import {StepCtx} from './step-context'
import { newObjProxy } from './helpers'

export class ItemReader {
	open(chkpt?: any): void { }
	close(): void { }
	readItem(): any { return null }
	checkpointInfo(): any { }
	before() { }
	after() { }
	onError(err: any) { }

	constructor() {}
}

export class ItemProcessor {
	before(item: any) { }
	processItem(item: any): any { return item }
	after(item: any, result: any) { }
	onError(item: any, err: any) { }

	constructor() {}
}

export class ItemWriter {
	open(chkpt?: any): void { }
	close(): void { }
	writeItems(items: any[]) { }
	checkpointInfo(): any { }
	before(items: any[]) { }
	after(items: any[]) { }
	onError(items: any[], err: any) { }

	constructor() {}
}

export class Chunk {
	public reader: ItemReader
	public writer: ItemWriter
	public processor: ItemProcessor
	public itemCount: number

	before(): any { }
	after(): any { }
	onError(err: any) { }

	constructor() {
		this.reader = new ItemReader()
		this.processor = new ItemProcessor()
		this.writer = new ItemWriter()
		this.itemCount = 1
	}
}

export function newItemWriterProxy(obj: any): ItemWriter {
	return newObjProxy(obj, new ItemWriter())
}

export function newItemProcessorProxy(obj: any): ItemProcessor {
	return newObjProxy(obj, new ItemProcessor())
}

export function newItemReaderProxy(obj: any): ItemReader {
	return newObjProxy(obj, new ItemReader())
}

export function newChunkProxy(obj: any): Chunk {
	obj = obj || {}
	const chunk = new Chunk()

	const writer = newItemWriterProxy(obj.writer)
	const reader = newItemReaderProxy(obj.reader)
	const processor = newItemProcessorProxy(obj.processor)

	chunk.reader = reader
	chunk.writer = writer
	chunk.processor = processor

	const handler = {
		get(target, prop, receiver) {
			// use proxy priority for reader/processor/writer
			if (['reader', 'processor', 'writer'].indexOf(prop) !== -1) {
				return Reflect.get(chunk, prop, receiver)
			}
			// return prop in obj if any
			if (prop in obj) { return Reflect.get(obj, prop, receiver)}
			// return prop in proxy otherwise
			return Reflect.get(target, prop, receiver)
		}
	}

	return new Proxy(chunk, handler)
}