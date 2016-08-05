export enum StoreType { MEMORY, DISK, STDOUT }

export interface Datastore {
	open(uri: string, opts?: any): Promise<this>
	close(opts?: any): Promise<void>
	insert(doc: any, opts?: any): Promise<string>
	find(query: any, opts?: any): Promise<any[]>
	update(selector: any, doc: any, opts?: any): Promise<string[]>
	delete(filter: any, opts?: any): Promise<number>
}

export class NullStore {
	open(uri: string, opts?: any): Promise<this> {
		return Promise.resolve(this)
	}

	close(opts?: any): Promise<void> {
		return Promise.resolve()
	}

	insert(doc: any, opts?: any): Promise<string> {
		return Promise.resolve('')
	}

	find(query: any, opts?: any): Promise<any[]> {
		return Promise.resolve([])
	}

	update(selector: any, doc: any, opts?: any): Promise<string[]> {
		return Promise.resolve([])
	}

	delete(filter: any, opts?: any): Promise<number> {
		return Promise.resolve(0)
	}
}