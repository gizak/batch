import {Datastore} from '../datastore'
import * as MemData from 'nedb'

export class NeDB implements Datastore {
	private db: MemData

	open(uri: string, opts?: any): Promise<this> {
		this.db = new MemData()
		return Promise.resolve(this)
	}

	close(): Promise<void> {
		return Promise.resolve()
	}

	insert(doc: any): Promise<string> {
		return new Promise((resolve, reject) => {
			this.db.insert(doc, (err, newdoc) => {
				if (err) reject(err)
				else resolve(newdoc._id)
			})
		})
	}

	find(match: any, opts?: any): Promise<any[]> {
		return new Promise((resolve, reject) => {
			this.db.find(match, (err, docs: any[]) => {
				if (err) reject(err)
				else resolve(docs)
			})
		})
	}

	delete(match: any, opts?: any): Promise<number> {
		return new Promise((resolve, reject) => {
			this.db.remove(match, opts, (err, n) => {
				if (err) reject(err)
				else resolve(n)
			})
		})
	}

	update(match: any, doc: any, opts?: any): Promise<string[]> {
		return new Promise((resolve, reject) => {
			this.db.update(match, doc, opts, (err, n, docs: any[]) => {
				if (err) reject(err)
				else resolve(docs.map(doc => {return doc._id}))
			})
		})
	}
}