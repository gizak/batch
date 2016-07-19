import {JobRepository} from './job-repository'
import {BatchRuntime} from './batch'

/**
 * JobOperator
 */
export class JobOperator {
	private db: JobRepository

	constructor() { }

	loadJob(job: any):Promise<string> {
		return this.db.addJob(job)
	}

	lsJobs(): Promise<string[]> {
		return this.db.getJobIds()
	}

	initRepository() {
		this.db = BatchRuntime.getJobRepository()
	}
}