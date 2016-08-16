import {Job} from './job'

export class JobInstance {
	private job: Job
	private id: string
	private jobId: string
	private status: string

	constructor(jobo: Job, id: string) {
		this.job = jobo
		this.id = id
		this.jobId = jobo.id
	}
	/**
	 * getInstanceId
	 * @return job instance id
	 */
	getInstanceId(): string {
		return this.id
	}
	/**
	 * Get job name
	 * @return value of 'id' attribute from <job>
	 */
	getJobName(): string {
		return this.job.id
	}

	getJob(): Job {
		return this.job
	}

	setStatus(s: string): this {
		this.status = s
		return this
	}

	getStatus(): string { return this.status }
}