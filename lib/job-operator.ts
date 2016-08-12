import {JobRepository} from './job-repository'
import {BatchRuntime} from './runtime'
import {JobInstance} from './job-instance';
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

	newJobInstance(jobid: string): Promise<JobInstance> {
		return BatchRuntime.getJobRepository().getJob(jobid).then(job => {
			const fpath = job.path
			delete require.cache[fpath]
			const jobo = require(fpath)
			return BatchRuntime.getJobRepository().addJobInstance(jobid).then((n: number) => {
				return new JobInstance(jobo, n)
			})
		})
	}
}