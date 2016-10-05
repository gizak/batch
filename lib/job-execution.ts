import * as shortid from 'shortid'

export class JobExec {
	public createTime: Date
	public startTime: Date
	public endTime: Date
	public updatedTime: Date

	public readonly jobName: string
	public readonly id: string
	private readonly _id: string

	constructor(jname: string) {
		this.updatedTime = this.createTime = new Date()
		this.id = this._id = shortid.generate()
		this.jobName = jname
	}
}