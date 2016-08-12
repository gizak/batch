import {Job} from './Job'

export class JobInstance {
	private job: Job
	private id: number
	private jobId: string
	private status: string

	constructor(jobo: Job, id: number) {
		this.job = jobo
		this.id = id
		this.jobId = jobo.id
	}
	/**
	 * getInstanceId
	 * @return job instance id
	 */
	getInstanceId(): number {
		return this.id
	}
	/**
	 * Get job name
	 * @return value of 'id' attribute from <job>
	 */
	getJobName(): string {
		return this.job.id
	}
}