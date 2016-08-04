export interface Datastore {
	open(uri: string, opts?: any): Promise<this>
	close(opts?: any): Promise<void>
	insert(doc: any, opts?: any): Promise<string>
	find(query: any, opts?: any): Promise<any[]>
	update(selector: any, doc: any, opts?: any): Promise<string[]>
	delete(filter: any, opts?: any): Promise<number>
}