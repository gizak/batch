import {JobRepository} from './job-repository'
import {BatchRuntime} from './runtime'

/**
 * JobOperator
 */
export class JobOperator {
	constructor() { }

	loadJob(jobfile: string): Promise<string> {
		return BatchRuntime.getJobRepository().addJob(jobfile)
	}

	lsJobs(): Promise<string[]> {
		return BatchRuntime.getJobRepository().getJobIds()
	}

	getJob(jobid: string): Promise<any> {
		return BatchRuntime.getJobRepository().getJob(jobid)
	}
}