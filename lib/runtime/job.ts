import {Step} from './step'
import {Status} from '../runtime'
import * as shortid from 'shortid'

export class JobContext {
	private _name: string
	private _transData: any
	private _exitStatus: string

	jobName(): string { return this._name }
	get transientUserData(): any {return this._transData}
	set transientUserData(data: any) {}
	instId(): string { return ''}
	execId(): string { return ''}
	status(): Status { return 0}
	set exitStatus(s: string) {}
	get exitStatus(): string {return this._exitStatus}
}

export class Job {
	public id: string
	public path: string
	public steps: Step[]
	public restartable: boolean

	private _status: Status
	private _instId: string
	private _created: Date
	public _id: string

	constructor() {
		this._created = new Date()
		this._status = Status.STARTING
		this._instId = shortid.generate()
		this._id = this._instId
	}

	before() {}
	after() {}
}