export interface  ItemReader {
	open(chkp?: any): void
	close(): void
	readItem(): any
	checkpointInfo(): any
}

export interface ItemReadListener {
	beforeRead(): void
	afterRead(item: any): void
	onReadError(e: Error): void
}

export interface ItemProcessor {
	processItem(item: any): any
}

export interface ItemProcessListener {
	beforeProcess(item: any): void
	afterProcess(item: any, result: any): void
	onProcessError(item: any, e: Error): void
}


export interface ItemWriter {
	open(chkp?: any): void
	close(): void
	writeItem(items: any[]): void
	checkpointInfo(): any
}

export interface ItemWriteListener {
	beforeWrite(items: any[]): void
	afterWrite(items: any[]): void
	onWriteError(items: any[], e: Error): void
}

export interface Chunk extends ItemReader, ItemProcessor, ItemWriter {}

export interface ChunkListener {
	beforeChunk(): void
	afterChunk(): void
	onError(e: Error): void
}