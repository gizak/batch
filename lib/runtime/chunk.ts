import {enumerable} from 'core-decorators'
import {JobCtx} from './job'
import {StepCtx} from './step'

export class ItemReader {
	public stepCtx: StepCtx // stub
	public jobCtx: JobCtx // stub

	@enumerable
	open(chkpt?: any): void { }

	@enumerable
	close(): void { }

	@enumerable
	readItem(): any { return null }

	@enumerable
	checkpointInfo(): any { }

	@enumerable
	before() { }

	@enumerable
	after() { }

	@enumerable
	onError(err: any) { }
}

export class ItemProcessor {
	public stepCtx: StepCtx // stub
	public jobCtx: JobCtx // stub

	@enumerable
	before(item: any) { }

	@enumerable
	processItem(item: any): any { return item }

	@enumerable
	after(item: any, result: any) { }

	@enumerable
	onError(item: any, err: any) { }
}

export class ItemWriter {
	public stepCtx: StepCtx // stub
	public jobCtx: JobCtx // stub

	@enumerable
	open(chkpt?: any): void { }

	@enumerable
	close(): void { }

	@enumerable
	writeItems(items: any[]) { }

	@enumerable
	checkpointInfo(): any { }

	@enumerable
	before(items: any[]) { }

	@enumerable
	after(items: any[]) { }

	@enumerable
	onError(items: any[], err: any) { }
}

export class Chunk {
	public reader: ItemReader
	public writer: ItemWriter
	public processor: ItemProcessor
	public itemCount: number

	public stepCtx: StepCtx // stub
	public jobCtx: JobCtx // stub


	@enumerable
	before(): any { }
	@enumerable
	after(): any { }
	@enumerable
	onError(err: any) { }

	constructor() {
		this.reader = new ItemReader()
		this.processor = new ItemProcessor()
		this.writer = new ItemWriter()
		this.itemCount = 1
	}
}