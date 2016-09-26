import { Repo } from './repository'
import { readFileSync } from 'fs'
import { Job } from './job'
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
		// const rjob = newRawJob(js)
		// const jobp = newJobInst(rjob)
	}

	async _newJobInst(js: JobScript) {

	}
	async _newJobExec(ji: Job ) {}
}