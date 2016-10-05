import { Repo } from './repository'
import { readFileSync } from 'fs'
import { Job } from './job'
import { JobExec } from './job-execution'
import { JobScript, newVMScriptFromFile, newRawJob, newJobInst } from './loader'

export class Operator {
	private readonly db: Repo

	constructor(repo: Repo) {
		this.db = repo
	}

	// load job script into db
	// return id
	async _loadJobFromFile(fpath: string) {
		const js = newVMScriptFromFile(fpath)
		this.db.jScripts[js._id] = js
		return await this.db.addScript(js)
	}

	// new job instance from js,
	// store it in db 
	// return new jobInst id
	_newJobInst(js: JobScript): Job {
		const rjob = newRawJob(js)
		// yup, new runtime object
		const rt  = { jobContext: {}, stepContext: {} }
		const job = newJobInst(rjob, rt)
		this.db.jInsts[job._id] = job
		return job
	}

	_newJobExec(ji: Job ): JobExec {
		const je = new JobExec(ji.id)
		this.db.jExecs[je.id] = je
		return je
	}
}