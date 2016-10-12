import { Stateful } from './status'
import { Repo } from './repository'
import * as shortid from 'shortid'

export class StepExec extends Stateful {
	public readonly stepExecId: string
	public readonly stepName: string
	public readonly execId: string

	private readonly _id: string
	private readonly _db: Repo

	constructor(repo: Repo, execId: string) {
		super()
		this.execId = execId
		this.stepExecId = this._id = shortid.generate()
		this._db = repo
	}

	async getPersistentUserData(): Promise<any> {
		return await this._db.getStepPerstData(this._id)
	}
}