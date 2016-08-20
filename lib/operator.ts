import * as PouchDB from 'pouchdb'
import * as bunyan from 'bunyan'
import {Repository} from './runtime/repository'
import {Job} from './runtime/job'

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

	start(jfile: string): string {
		const path = require.resolve(jfile)
		const obj = require(path)
		delete require.cache[path]

		const j = objToJob(obj)
		j.path = path

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

function objToJob(obj: any): Job {
	const j = new Job()
	Object.getOwnPropertyNames(obj).forEach((k) => {
		if (obj[k]) {
			j[k] = obj[k]
		}
	})

	return j
}