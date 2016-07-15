import {JobRepository} from './job-repository'
import {BatchRuntime} from './batch'

/**
 * JobOperator
 */
export class JobOperator {
	private db: JobRepository

	constructor() {}

	loadJob(job: Object): boolean {
		this.db.addJob(job)
		return true
	}

	lsJobs(): string[] {
		return this.db.getJobIds()
	}

	initRepository() {
		this.db = BatchRuntime.getJobRepository()
	}
}