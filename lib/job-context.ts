import { Job } from './job'
import { JobExec } from './job-execution'
import { JobRuntime} from './job-runtime'

export class JobCtx {
	private _transData: any
	private _exitStatus: string
	private _runtime: JobRuntime
	private _exec: JobExec

	constructor() {
		this._exec = je
		this._runtime = runtime
		this._exitStatus = null
	}

	_bind() {}

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