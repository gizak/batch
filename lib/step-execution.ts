import { Status } from './runtime'

export class StepExec {
	public readonly stepExecId: string
	public readonly stepName: string
	public startTime: Date
	public endTime: Date

	public batchStatus: Status
	private _exitStatus: string

	constructor() {
		this.batchStatus = Status.STARTING
		this.startTime = new Date()
	}

	get exitStatus(): string {
		if ( this._exitStatus === null ) {
			return Status[this.batchStatus]
		}
		return this._exitStatus
	}

	set exitStatus(s: string) {
		this._exitStatus = s
	}

	get persistentUserData(): any {
		return null
	}
}