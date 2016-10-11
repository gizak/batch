import { Stateful } from './status'
import { Repo } from './repository'
import * as shortid from 'shortid'

export class StepExec extends Stateful {
	public readonly stepExecId: string
	public readonly stepName: string

	public readonly _id: string

	private readonly _execId: string
	private readonly _db: Repo

	constructor(repo: Repo, execId: string, stepId: string) {
		super()
		this._id = shortid.generate()
		this._execId = execId
		this.stepExecId = stepId
		this._db = repo
	}

	async getPersistentUserData(): Promise<any> {
		return this._db.getStepPerstDataByExec(this._execId, this.stepExecId)
	}
}