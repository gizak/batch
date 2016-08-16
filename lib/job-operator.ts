import {JobRepository} from './job-repository'
import {BatchRuntime} from './runtime'
import {JobInstance} from './job-instance'
import * as Debug from 'debug'

const debug = Debug('JobOperator')

/**
 * JobOperator
 */
export class JobOperator {
	constructor() { }

	loadJob(jobfile: string): Promise<string> {
		debug('Load job: %s', jobfile)
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
			return BatchRuntime.getJobRepository().regJobInstance(jobid).then((id: string) => {
				const ji = new JobInstance(jobo, id)
				debug('Create job %s instance %s', jobo.id, id)
				BatchRuntime.getJobRepository().addJobInstance(ji)
				return ji
			})
		})
	}

	startJobInst(jid) {
		BatchRuntime.emit('START_JOB_INSTANCE', jid)
		const ji = BatchRuntime.getJobRepository().getJobInstance(jid)

	}

	_dumpRuntimeDS(): void {
		BatchRuntime.getJobRepository()._dumpAll()
	}
}