import { Operator } from './operator'
import { Repo } from './repository'

export enum Status {STARTING, STARTED, STOPPING, STOPPED, FAILED, COMPLETED, ABANDONED}

export class Runtime {
	private static db: Repo
	private static _op: Operator | null
	static get operator(): Operator {
		if (!this._op) {
			this._op = new Operator(this.db)
		}
		return this._op
	}

	static init() {
		
	}
}