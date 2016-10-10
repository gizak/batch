import { Repo } from './repository'
import { readFileSync } from 'fs'
import { Job } from './job'
import { JobCtx } from './job-context'
import { JobExec } from './job-execution'
import { JobScript, newVMScriptFromFile, newRawJob, newJobInst } from './loader'

export class Operator {
	private readonly db: Repo

	constructor(repo: Repo) {
		this.db = repo
	}

	// load job script into db
	// return id
	async _loadJobScriptFromFile(fpath: string): Promise<JobScript> {
		// load from cache
		for (const _id in this.db.jScripts) {
			if (this.db.jScripts[_id].fpath === fpath ) {
				return this.db.jScripts[_id]
			}
		}
		// otherwise add it 
		const js = newVMScriptFromFile(fpath)
		this.db.jScripts[js._id] = js
		await this.db.addScript(js)
		return Promise.resolve(js)
	}

	// new job instance from js,
	// store it in db 
	// return new jobInst id
	_newJobInst(js: JobScript): Job {
		const rjob = newRawJob(js)
		//this.db.jRaw[rjob._]
		// yup, new runtime object
		const rt  = { jobContext: {}, stepContext: {} }
		const job = newJobInst(rjob, rt)
		this.db.jInsts[job._id] = job
		return job
	}

	async _newJobExec(ji: Job ): Promise<JobExec> {
		const je = new JobExec(ji.id)
		this.db.jExecs[je.id] = je
		return je
	}

	_newJobCtx(ji, je): JobCtx {
		const jc =  new JobCtx(ji.id, ji._id, je.id)
		this.db.jCtxs[jc.executionId]
		return jc 
	}

	async _initJob(fpath: string) {
		const js = await this._loadJobScriptFromFile(fpath)
		const ji = this._newJobInst(js)
		const je = await this._newJobExec(ji)
		const jc = this._newJobCtx(ji,je)
	}
}