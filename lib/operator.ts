import * as PouchDB from 'pouchdb'
import * as bunyan from 'bunyan'
import {Repository} from './runtime/repository'
import {Job} from './runtime/job'
import {Step} from './runtime/step'
import {Chunk} from './runtime/chunk'
import {Batchlet} from './runtime/batchlet'
import * as _ from 'lodash'

interface JobInst {}
interface JobExec {}
interface StepExec {}

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

	jobInsts(jname: string, start?: number, count?: number): JobInst[] {
		return this.repo.jobInsts.slice(start).slice(0, count)
	}

	runningExecs(jname: string): string[] {
		return []
	}

	private _startJobInst(j: Job) {
		j.before()
		for (const step of j.steps) {
			step.before()

			if (step.chunk) {

				const ck = step.chunk
				ck.reader.open()
				ck.writer.open()
				ck.before()

				const isCont = true
				ck.reader.before()
				for (let item = ck.reader.readItem(); isCont && item != null; item = ck.reader.readItem()) {
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

				ck.reader.close()
				ck.writer.close()
				ck.after()
			}
			step.after()
		}
		j.after()
	}

	start(jfile: string): string {
		const path = require.resolve(jfile)
		const obj = require(path)
		delete require.cache[path]

		const j = _objToJob(obj)
		j.path = path

		this._startJobInst(j)
		return ''
	}

	restart(execId: string): string {
		return ''
	}

	stop(execId: string): void {

	}

	abandon(execId: string) {}

	jobInst(execId: string): JobInst {
		return null
	}

	jobExecs(inst: JobInst): JobExec[] {
		return []
	}

	jobExec(execId: string): JobExec {
		return null
	}

	stepExecs(execId: string): StepExec[] {
		return []
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
		throw new TypeError(`${obj.name} should provide steps`)
	}
	return obj
}