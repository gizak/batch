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

export class JobContext extends JobExec {
	private _transData: any
	private _exitStatus: string
	private _jobInst: Job

	constructor(ji: Job) {
		super(ji.id)
		this._jobInst = ji
	}

	get transientUserData(): any {return this._transData}
	set transientUserData(data: any) { this._transData = data }
	instId(): string { return this._jobInst._id }
}