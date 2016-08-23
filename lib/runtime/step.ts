import {Status} from '../runtime'
import {Chunk} from './chunk'
import {Batchlet} from './batchlet'
import {enumerable} from 'core-decorators'

export class Step {
	public chunk: Chunk
	public batchlet: Batchlet

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

	execId(): string { return '' }
	stepName(): string { return '' }

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
	exitStatus(): string { return '' }
}

export class StepContext {
	private _name: string
	private _transData: any

	get stepName(): string { return this._name }
	get transientUserData(): any { return this._transData }
	set transientUserData(data: any) { this._transData = data }
	execId(): string { return '' }
	get persistentUserData(): any { return '' }
	set persistentUserData(data: any) {}
	status(): Status { return 0 }
	get exitStatus(): string { return ''}
	set exitStatus(s: string) {}
}