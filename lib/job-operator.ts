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

	initRepository(options: any): Promise<this> {
		this.db = BatchRuntime.getJobRepository(options)
		return this.db.init().then(()=>{ return this })
	}
}