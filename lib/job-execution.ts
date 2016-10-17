import * as shortid from 'shortid'
import { Stateful } from './status'

export class JobExec extends Stateful {

	public readonly jobName: string
	public readonly id: string
	private readonly _id: string
	public readonly instId: string

	constructor(jname: string, instId: string) {
		super()
		this.id = this._id = shortid.generate()
		this.jobName = jname
		this.instId = instId
	}
}