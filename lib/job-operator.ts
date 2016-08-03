import {JobRepository} from './job-repository'
import {BatchRuntime} from './batch'

/**
 * JobOperator
 */
export class JobOperator {
	private db: JobRepository

	constructor() { }

	loadJob(jobfile: string): Promise<string> {
		return this.db.addJob(jobfile)
	}

	lsJobs(): Promise<string[]> {
		return this.db.getJobIds()
	}

	getJob(jobid: string): Promise<any> {
		return this.db.getJob(jobid)
	}

	initRepository() {
		this.db = BatchRuntime.getJobRepository()
	}
}