import * as PouchDB from 'pouchdb'
import * as bunyan from 'bunyan'
import {Status} from './runtime'
import {Repository} from './runtime/repository'
import {Job, JobExec, JobContext} from './runtime/job'
import {Step, StepExec, StepContext} from './runtime/step'
import {Chunk} from './runtime/chunk'
import {Batchlet} from './runtime/batchlet'
import * as _ from 'lodash'

export class Operator {
	private db: PouchDB.Database<{}>
	private log: bunyan.Logger
	private repo: Repository

	constructor(db: PouchDB.Database<{}>, log: bunyan.Logger, repo: Repository) {
		this.db = db
		this.log = log
		this.repo = repo
	}

	jobInstCnt(jname: string): number {
		return this.repo.jobInsts.length
	}

	jobInsts(jname: string, start?: number, count?: number): Job[] {
		return this.repo.jobInsts.slice(start).slice(0, count)
	}

	runningExecs(jname: string): string[] {
		return this.repo.jobExecs
		.filter((je: JobExec) => {
			return je.jobName() === jname
		}).map((je: JobExec) => {
			return je.execId()
		})
	}

	private async _startJobInst(j: Job) {
		// create job context
		const je = new JobExec(j.id)
		je.status = Status.STARTING
		const jc = new JobContext(j, je)
		this.repo.jobExecs.push(je)
		this.repo.jobCtx.push(jc)

		j.before()
		je.status = Status.STARTED

		for (const step of j.steps) {
			// step context
			const se = new StepExec(je.execId(), step.id)
			se.status = Status.STARTING
			this.repo.stepExecs.push(se)
			const sc = new StepContext(step, se)
			this.repo.stepCtx.push(sc)

			step.before()
			se.status = Status.STARTED

			if (step.chunk) {

				const ck = step.chunk
				await ck.reader.open()
				await ck.writer.open()
				ck.before()

				const isCont = true
				ck.reader.before()
				for (let item = await ck.reader.readItem(); isCont && item != null; item = await ck.reader.readItem()) {
					ck.reader.after()
					// process
					ck.processor.before(item)
					const result = ck.processor.processItem(item)
					ck.processor.after(item, result)
					// write
					ck.writer.before([result])
					ck.writer.writeItems([result])
					ck.writer.after([result])

					ck.before()
				}

				await ck.reader.close()
				await ck.writer.close()
				ck.after()
			}
			step.after()
			se.status = Status.COMPLETED
		}
		j.after()
		je.status = Status.COMPLETED
	}

	start(jfile: string): string {
		const path = require.resolve(jfile)
		const obj = require(path)
		delete require.cache[path]

		const j = _objToJob(obj)
		j.path = path

		setImmediate(() => { this._startJobInst(j) })
		return ''
	}

	restart(execId: string): string {
		return ''
	}

	stop(execId: string): void {

	}

	abandon(execId: string) {}

	jobInst(execId: string): Job {
		const jc = this.repo.jobCtx.find((jc: JobContext) => {
			return jc.execId() === execId
		})

		if (!jc) { throw new Error('Could not find an alive job instance with execution ID: ' + execId)}

		return this._jobInst(jc.instId())
	}

	_jobInst(jiid: string) {
		return this.repo.jobInsts.find((ji: Job) => { return ji._id === jiid })
	}

	jobExecs(inst: Job): JobExec[] {
		const jcs = this.repo.jobCtx.filter((jc: JobContext) => {
			return jc.instId() === inst._id
		})

		return jcs.map((jc: JobContext) => {
			return this.jobExec(jc.execId())
		})
	}

	jobExec(execId: string): JobExec {
		return this.repo.jobExecs.find((je: JobExec) => {
			return je.execId() === execId
		})
	}

	stepExecs(execId: string): StepExec[] {
		return this.repo.stepExecs.filter((se: StepExec) => {
			return se.jobExecId() === execId
		})
	}
}

function _objToJob(obj: any): Job {
	const j = new Job()
	_.defaultsDeep(obj, new Job())
	if (obj.steps) {
		for (const step of obj.steps) {
			_.defaultsDeep(step, new Step())
			if (step.chunk) { _.defaultsDeep(step.chunk, new Chunk()) }
			if (step.batchlet) { _.defaultsDeep(step.batchlet, new Batchlet()) }
		}
	} else {
		throw new TypeError(`${obj.name} has no .steps`)
	}
	return obj
}