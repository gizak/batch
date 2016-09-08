import {Status} from '../runtime'
import {Chunk} from './chunk'
import {JobCtx} from './job'
import {Batchlet} from './batchlet'
import {enumerable} from 'core-decorators'
import * as shortid from 'shortid'

export class Step {
	public chunk: Chunk
	public batchlet: Batchlet
	public id: string
	public stepCtx: StepCtx // stub
	public jobCtx: JobCtx // stub

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
	private _jobExecId: string

	constructor(jeid: string, sid: string) {
		this._id = shortid.generate()
		this._step = sid
		this._jobExecId = jeid
	}

	execId(): string { return this._id }
	stepName(): string { return this._step }
	jobExecId(): string { return this._jobExecId }

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

export class StepCtx {
	private _transData: any
	private _exec: StepExec
	private _step: Step
	private _exitStatus: string

	constructor(s: Step, se: StepExec) {
		this._step = s
		this._exec = se
		this._transData = {}
		this._exitStatus = null
	}

	stepName(): string { return this._step.id}

	get transientUserData(): any { return this._transData }
	set transientUserData(data: any) { this._transData = data }

	get persistentUserData(): any { return '' }
	set persistentUserData(data: any) {}

	get status(): Status { return this._exec.status }

	get exitStatus(): string {
		if (this._exitStatus) {
			return this._exitStatus
		}
		return this._exec.exitStatus()
	}
	set exitStatus(s: string) {
		this._exitStatus = s
	}
}