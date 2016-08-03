export interface  ItemReader extends ItemReadListener {
	open(chkp?: any): void
	close(): void
	readItem(): any
	checkpointInfo(): any
}

export abstract class ItemReadListener {
	beforeRead(): void {}
	afterRead(item: any): void {}
	onReadError(e: Error): void { throw e }
}

export interface ItemProcessor extends ItemProcessListener {
	processItem(item: any): any
}

export abstract class ItemProcessListener {
	beforeProcess(item: any): void {}
	afterProcess(item: any, result: any): void {}
	onProcessError(item: any, e: Error): void { throw e }
}


export interface ItemWriter extends ItemWriteListener {
	open(chkp?: any): void
	close(): void
	writeItem(items: any[]): void
	checkpointInfo(): any
}

export abstract class ItemWriteListener {
	beforeWrite(items: any[]): void {}
	afterWrite(items: any[]): void {}
	onWriteError(items: any[], e: Error): void { throw e }
}

export interface Chunk extends ItemReader, ItemProcessor, ItemWriter, ChunkListener {}

export abstract class ChunkListener {
	beforeChunk(): void {}
	afterChunk(): void {}
	onError(e: Error): void { throw e }
}