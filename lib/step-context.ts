import { Job } from './job'
import { JobExec } from './job-execution'
import { Status } from './status'
import { Repo } from './repository'

export class StepCtx {

	private _exitStatus: string | null
	private _status: Status
	private _db: Repo

	public readonly stepExecutionId: string
	public readonly stepName: string
	public transientUserData: any

	constructor(db: Repo, sname: string, stepExecId: string) {
		this.stepName = sname
		this.stepExecutionId = stepExecId
		this._exitStatus = null
		this.transientUserData = {}
		this._status = Status.STARTING
		this._db = db
	}


	async getPersisentUserData() { return this._db.getStepPerstData(this.stepExecutionId) }
	async setPersisentUserData(data: any) { return this._db.setStepPerstData(this.stepExecutionId, data)}

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