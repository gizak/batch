import { Job } from './job'
import { JobExec } from './job-execution'
import { Status } from './runtime'

export class StepCtx {
	private _transData: any
	private _exitStatus: string | null
	private _status: Status

	public readonly stepExecutionId: string
	public readonly stepName: string

	constructor(sname: string, stepExecId: string) {
		this.stepName = sname
		this.stepExecutionId = stepExecId
		this._exitStatus = null
		this._transData = null
		this._status = Status.STARTING
	}

	get transientUserData(): any { return this._transData }
	set transientUserData(data: any) { this._transData = data }

	get persisentUserData(): any { return null }
	set persisentUserData(data: any) {}

	get exitStatus(): string {
		if ( this._exitStatus === null ) {
			return Status[this._status]
		}
		return this._exitStatus
	}

	set exitStatus(s: string) {
		this._exitStatus = s
	}
}