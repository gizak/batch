export class JobExec {
	public createTime: Date
	public startTime: Date
	public endTime: Date
	public updatedTime: Date

	constructor() {
		this.createTime = new Date()
	}
}