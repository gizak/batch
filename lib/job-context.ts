import { Job } from './job'
import { JobExec } from './job-execution'
import { JobRuntime} from './job-runtime'
import { Status } from './runtime'

export class JobCtx {
	private _transData: any
	private _exitStatus: string | null
	private _status: Status

	public readonly executionId: string
	public readonly instanceId: string
	public readonly jobName: string

	constructor(jname: string, instId: string, execId: string) {
		this.jobName = jname
		this.instanceId = instId
		this.executionId = execId
		this._exitStatus = null
		this._transData = null
		this._status = Status.STARTING
	}


	get transientUserData(): any { return this._transData }
	set transientUserData(data: any) { this._transData = data }

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