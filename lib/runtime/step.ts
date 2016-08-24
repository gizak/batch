import {Status} from '../runtime'
import {Chunk} from './chunk'
import {Batchlet} from './batchlet'
import {enumerable} from 'core-decorators'
import * as shortid from 'shortid'

export class Step {
	public chunk: Chunk
	public batchlet: Batchlet
	public id: string

	@enumerable
	public before() {}

	@enumerable
	public after() {}

	constructor() {
		this.chunk = null
		this.batchlet = null
	}
}

export class StepExec {
	private _started: Date
	private _ended: Date
	private _status: Status
	private _step: string
	private _id: string

	constructor(sid: string) {
		this._id = shortid.generate()
		this._step = sid 	
	}

	execId(): string { return this._id }
	stepName(): string { return this._step }

	get status(): Status { return this._status }
	set status(s: Status) {
		this._status = s

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
}

export class StepContext extends StepExec {
	private _transData: any
	
	constructor(s: Step) {
		super(s.id)
		this._transData = {}
	}
	
	get transientUserData(): any { return this._transData }
	set transientUserData(data: any) { this._transData = data }
	get persistentUserData(): any { return '' }
	set persistentUserData(data: any) {}
}