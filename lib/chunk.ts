interface  ItemReader {
    open(chkp: any): void
    close(): void
    readItem(): any
    checkpointInfo():any 
}

interface ItemProcessor {
    processItem(item: any): any
}

interface ItemWriter {
    open(chkp: any): void
    close(): void
    writeItem(items: any[]): void
    checkpointInfo():any 
}