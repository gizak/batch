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
}

export class ItemProcessor {
	before(item: any) { }
	processItem(item: any): any { return item }
	after(item: any, result: any) { }
	onError(item: any, err: any) { }
}

export class ItemWriter {
	open(chkpt?: any): void { }
	close(): void { }
	writeItems(items: any[]) { }
	checkpointInfo(): any { }
	before(items: any[]) { }
	after(items: any[]) { }
	onError(items: any[], err: any) { }
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
	const chunk = new Chunk()
	
	const writer = newItemWriterProxy(obj.writer)
	const reader = newItemReaderProxy(obj.reader)
	const processor = newItemProcessorProxy(obj.processor)

	chunk.reader = reader
	chunk.writer = writer
	chunk.processor = processor

	const handler = {
		get(target, prop, receiver) {
			if (prop in ["reader", "processor", "writer"]) {
				return Reflect.get(target, prop, receiver)
			}
			if (prop in obj) { return Reflect.get(obj, prop, receiver)}
			return Reflect.get(target, prop, receiver)
		}
	}

	return new Proxy(chunk, handler) 
}