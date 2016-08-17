import {JobRepository} from './job-repository'
import {BatchRuntime} from './runtime'
import {JobInstance} from './job-instance'
import * as Debug from 'debug'
import {Step} from './step'
import {Chunk} from './chunk'

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
		BatchRuntime.emit('JOB_INST_STARTING', jid)
		const ji = BatchRuntime.getJobRepository().getJobInstance(jid)
		const j = ji.getJob()
		if (j.listener && j.listener.beforeJob)
			j.listener.beforeJob()
		BatchRuntime.emit('JOB_INST_STARTED')

		for (const s of j.steps) {
			console.log(s)
			s.beforeStep()

			if (s.chunk) {
				const ck = s.chunk
				ck.beforeChunk()
				ck.open()

				let isCont = true
				while (isCont) {
					// read
					ck.beforeRead()
					const item = ck.readItem()
					if (!item) {
						isCont = false
						continue
					}
					ck.afterRead(item)

					// process
					ck.beforeProcess(item)
					const result = ck.processItem(item)
					ck.afterProcess(item, result)

					// write
					ck.beforeWrite([result])
					ck.writeItem([result])
					ck.afterWrite([result])
				}

				ck.afterChunk()
			}

			else if (s.batchlet) {
				const bl = s.batchlet
				bl.process()
			}

			s.afterStep()
		}
		if (j.listener && j.listener.afterJob)
			j.listener.afterJob()
	}

	_dumpRuntimeDS(): void {
		BatchRuntime.getJobRepository()._dumpAll()
	}
}