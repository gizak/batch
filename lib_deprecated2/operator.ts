import * as PouchDB from 'pouchdb'
import * as bunyan from 'bunyan'
import { Status } from './runtime'
import { Repository } from './runtime/repository'
import { Job, JobExec, JobCtx } from './runtime/job'
import { Step, StepExec, StepCtx } from './runtime/step'
import { Chunk } from './runtime/chunk'
import { Batchlet } from './runtime/batchlet'
import * as _ from 'lodash'
import { queue, parallel } from 'async'

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

	_injectJob(j: Job, key: string, val: any) {
		j[key] = val
		this._injectSteps(j, key, val)
	}

	_injectSteps(j: Job, key: string, val: any) {
		for (const step of j.steps) {
			step[key] = val
			if (step.chunk) {
				step.chunk[key] = val
				step.chunk.reader[key] = val
				step.chunk.processor[key] = val
				step.chunk.writer[key] = val
			}

			if (step.batchlet) {
				step.batchlet[key] = val
			}
		}
	}

	_before(j: Job): JobExec {
		// create job context
		const je = new JobExec(j)
		je.status = Status.STARTING
		this.repo.jobExecs.push(je)
		this.repo.jobCtxs.push(je.jobCtx())
		this._injectJob(j, 'jobCtx', je.jobCtx())

		j.before()
		return je
	}

	private async _startJobInst(j: Job) {

		const je = this._before(j)
		je.status = Status.STARTED

		for (const step of j.steps) {
			// step context
			const se = new StepExec(je.execId(), step.id)
			se.status = Status.STARTING
			this.repo.stepExecs.push(se)
			const sc = new StepCtx(step, se)
			this.repo.stepCtxs.push(sc)

			step.before()
			se.status = Status.STARTED

			if (step.chunk) {
				// open
				const ck = step.chunk
				await ck.reader.open()
				await ck.writer.open()
				ck.before()

				// init work queque
				const worker = (task, cb) => { }
				const con = 1
				const q = queue(worker, con)

				const isCont = true
				let items = []
				const ps = []

				// parallel procress items
				async function procItems() {
					const workers = items.map((i) => {
						return (callback) => {
							// process
							ck.processor.before(i)
							Promise.resolve(ck.processor.processItem(i)).then(res => {
								ck.processor.after(i, res)
								callback(null, res)
							}).catch(err => {
								callback(err, null)
							})
						}
					})
					return new Promise((resolve, reject) => {
						parallel(workers, (err, results) => {
							if (err) { return reject(err) }
							resolve(results)
						})
					})
				}

				// write multi results
				async function writeResults(res) {
					ck.writer.before(res)
					await ck.writer.writeItems(res)
					ck.writer.after(res)
				}

				ck.reader.before()
				for (let item = await ck.reader.readItem(); isCont && item != null; item = await ck.reader.readItem()) {
					ck.reader.after()

					// round up items
					items.push(item)
					if (items.length === ck.itemCount) {
						// process
						const results = await procItems()
						// write
						await writeResults(results)
						// reset
						items = []
					}

					ck.reader.before()
				}

				// leftovers
				if (items) {
					await writeResults(await procItems())
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

	_load(jfile: string): Job {

		const path = require('path').resolve(jfile)
		delete require.cache[path]
		const obj = require(path)

		const j = _objToJob(obj)
		j.path = path

		this.repo.jobInsts.push(j)
		return j
	}

	start(jfile: string): string {
		const j = this._load(jfile)
		setImmediate(() => { this._startJobInst(j) })
		return ''
	}

	restart(execId: string): string {
		return ''
	}

	stop(execId: string): void {

	}

	abandon(execId: string) { }

	jobInst(execId: string): Job {
		const jc = this.repo.jobCtxs.find((jc: JobCtx) => {
			return jc.execId() === execId
		})

		if (!jc) { throw new Error('Could not find an alive job instance with execution ID: ' + execId) }

		return this._jobInst(jc.instId())
	}

	_jobInst(jiid: string) {
		return this.repo.jobInsts.find((ji: Job) => { return ji._id === jiid })
	}

	jobExecs(inst: Job): JobExec[] {
		const jcs = this.repo.jobCtxs.filter((jc: JobCtx) => {
			return jc.instId() === inst._id
		})

		return jcs.map((jc: JobCtx) => {
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
