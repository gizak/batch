import {Step} from './step'
import {Status} from '../runtime'
import * as shortid from 'shortid'
import {enumerable, readonly} from 'core-decorators'

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

	@enumerable
	before() {}

	@enumerable
	after() {}
}


export class JobExec {
	private _id: string
	private _jod: string
	private _created: Date
	private _updated: Date
	private _started: Date
	private _ended: Date
	private _status: Status

	constructor(jid: string) {
		this._id = shortid.generate()
		this._jod = jid
		this._created = new Date()
		this._updated = new Date()
		this._started = new Date()
		this._ended = null
		this._status = null
	}

	execId(): string { return this._id }

	jobName(): string { return this._jod }

	get status(): Status { return this._status }
	set status(s: Status) {
		this._status = s
		this._updated = new Date()

		switch (s) {
			case Status.STARTED:
			this._started = new Date()
			break

			case Status.STOPPED:
			case Status.ABANDONED:
			case Status.COMPLETED:
			case Status.FAILED:
			this._ended = new Date()
		}
	}

	startTime(): Date { return this._started }
	endTime(): Date { return this._ended }
	exitStatus(): string { return Status[this._status] }

	createTime(): Date {return this._created }

	updatedTime(): Date { return this._updated }
}

export class JobContext {
	private _transData: any
	private _exitStatus: string
	private _jobId: string
	private _inst: Job
	private _exec: JobExec

	constructor(ji: Job, je: JobExec) {
		this._inst = ji
		this._exec = je
		this._jobId = ji.id
		this._exitStatus = null
	}

	execId(): string {return this._exec.execId() }
	jobName(): string { return this._jobId }

	get transientUserData(): any {return this._transData}
	set transientUserData(data: any) { this._transData = data }

	get exitStatus(): string {
		if (this._exitStatus) {
			return this._exitStatus
		}
		return this._exec.exitStatus()
	}
	set exitStatus(s: string) {
		this._exitStatus = s
	}

	instId(): string { return this._inst._id }
}