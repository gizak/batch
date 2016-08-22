export class ItemReader {
    open(chkpt?: any):void {}
	close():void {}
	readItem(): any { return null }
    checkpointInfo(): any {}
    before() {}
    after() {}
    onError(err: any) {}
}

export class ItemProcessor {
    before(item: any) {}
    processItem(item: any): any { return item}
    after(item: any, result: any) {}
    onError(item: any, err: any) {}
}

export class ItemWriter {
    open(chkpt?: any): void {}
    close(): void {}
    writeItems(items: any[]) {}
    checkpointInfo(): any {}
    before(items: any[]) {}
    after(items: any[]) {}
    onError(items: any[], err: any) {}
}

export class Chunk {
    public reader: ItemReader
    public writer: ItemWriter
    public processor: ItemProcessor
    
    before():any {}
    after(): any {}
    onError(err: any) {}

    constructor() {
        this.reader = new ItemReader()
        this.processor = new ItemProcessor()
        this.writer = new ItemWriter()
    }
}