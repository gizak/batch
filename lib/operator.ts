import { Repo } from './repository'
import { readFileSync } from 'fs'
import { Job } from './job'
import { JobCtx } from './job-context'
import { JobExec } from './job-execution'
import { JobScript, newVMScriptFromFile, newRawJob, newJobInst } from './loader'
import { resolve } from 'path'
import { Status } from './status'
import { StepExec } from './step-execution'

export class Operator {
	private readonly db: Repo

	constructor(repo: Repo) {
		this.db = repo
	}

	// load job script into db
	// return id
	async _loadJobScriptFromFile(fpath: string): Promise<JobScript> {
		fpath = resolve(fpath)

		// pre-screen it
		const js = newVMScriptFromFile(fpath)
		const rjob = newRawJob(js)
		if ( !rjob.id ) {
			throw new EvalError('no id field specified in job file: ' + fpath)
		}
		const jname = rjob.id

		// load from cache
		if (jname in this.db.jScripts) {
			return this.db.jScripts[jname]
		}

		// otherwise add it 
		await this.db.addScript(js, jname)
		return js
	}

	// new job instance from js,
	// store it in db 
	// return new jobInst id
	_newJobInst(js: JobScript): Job {
		const rjob = newRawJob(js)
		// this.db.jRaw[rjob._]
		// yup, new runtime object
		const rt  = { jobContext: {}, stepContext: {} }
		const job = newJobInst(rjob, rt)
		this.db.jInsts[job._id] = job
		return job
	}

	async _newJobExec(ji: Job ): Promise<JobExec> {
		const je = new JobExec(ji.id, ji._id)
		this.db.jExecs[je.id] = je
		await this.db.addExec(je)
		return je
	}

	_newJobCtx(ji, je): JobCtx {
		const jc =  new JobCtx(ji.id, ji._id, je.id)
		this.db.jCtxs[jc.executionId] = jc
		return jc
	}

	async _initJob(fpath: string) {
		const js = await this._loadJobScriptFromFile(fpath)
		const ji = this._newJobInst(js)
		const je = await this._newJobExec(ji)
		const jc = this._newJobCtx(ji, je)
	}

	get jobNames(): string[] {
		return Object.keys(this.db.jScripts)
	}

	jobInsts(jobName: string): Job[] {
		let insts: Job[] = []
		for (const k in this.db.jInsts) {
			if (this.db.jInsts[k].id === jobName) {
				insts.push(this.db.jInsts[k] )
			}
		}
		return insts
	}

	jobInstCount(jobName: string) {
		const jis = this.db.jInsts
		let cnt = 0
		for ( const k in jis ) {
			if (jis[k].id === jobName) {
				cnt++
			}
		}
		return cnt
	}

	runningExecs(jobName: string): string[] {
		let execs: string[] = []
		const jes = this.db.jExecs
		for (const k in jes) {
			if (jes[k].jobName === jobName && 
				jes[k].batchStatus in [Status.STARTED, Status.STARTING, Status.STOPPING]) {
				execs.push(jes[k].id)
			}
		}
		return execs
	}

	jobInst(execId: string): Job {
		const exec = this.db.jExecs[execId]
		return this.db.jInsts[exec.instId]
	}

	jobExecs(inst: Job): JobExec[] {
		let execs: JobExec[] = []
		const jes = this.db.jExecs
		for (const k in jes) {
			if (jes[k].instId === inst._id) {
				execs.push(jes[k])
			}
		}
		return execs
	}

	jobExec(execId: string): JobExec {
		return this.db.jExecs[execId]
	}

	stepExecs(execId: string): StepExec[] {
		let ret: StepExec[] = []
		const ses = this.db.sExecs
		for ( const k in ses ) {
			if (ses[k].execId === execId ) {
				ret.push(ses[k])
			}
		}
		return ret
	}

	/*
	public start(jobpath: string): string {}
	public restart(execId: string): string {}
	public stop(execId: string) {}
	public abondon(execId: string) {}
	*/
}