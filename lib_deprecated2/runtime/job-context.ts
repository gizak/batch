import { Job } from './Job'
import { JobExec } from './job-execution'

export class JobCtx {
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