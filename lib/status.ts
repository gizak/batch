export enum Status {STARTING, STARTED, STOPPING, STOPPED, FAILED, COMPLETED, ABANDONED}

export class Stateful {
	public readonly createTime: Date
	public startTime: Date | null
	public endTime: Date | null
	public updatedTime: Date

	public _batchStatus: Status
	protected _exitStatus: string

	constructor() {
		this._batchStatus = Status.STARTING
		this.updatedTime = this.startTime = new Date()
	}

	get batchStatus(): Status {
		return this._batchStatus
	}

	set batchStatus(s: Status) {
		if (s === this._batchStatus) {
			return
		}
		switch (s) {
			case Status.STARTING:
				this.endTime = null
				this.startTime = null
				break
			case Status.STARTED:
				this.startTime = new Date()
				break
			case Status.COMPLETED:
			case Status.ABANDONED:
			case Status.FAILED:
				this.endTime = new Date()
				break
		}
		this._batchStatus = s
		this.updatedTime = new Date()
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
}