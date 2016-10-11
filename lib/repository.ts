import * as PouchDB from 'pouchdb'
import { Job } from './job'
import { JobExec } from './job-execution'
import { JobCtx } from './job-context'
import { StepExec } from './step-execution'
import { StepCtx } from './step-context'
import { Status } from './status'
import { JobScript } from './loader'

interface ExecDoc {
	_id: string
	_rev?: string
	ctime: string
	btime: string
	stime: string
	instId: string
	jobName: string
	status: Status
	steps: { [key: string]: StepExecDoc | null }[]
}

interface StepExecDoc {
	_id: string
	perstData: any
	chkPtData: any
	status: Status
	exitStatus: string
}

interface ScriptDoc {
	_id: string
	content: string
	ctime: string
	fpath: string
}

export class Repo {
	// in-memory
	public jScripts: { [key: string]: JobScript }
	public jRaw: { [key: string]: any }
	public jInsts: { [key: string]: Job }
	public jExecs: { [key: string]: JobExec }
	public jCtxs: { [key: string]: JobCtx }
	public sExecs: { [key: string]: StepExec }
	public sCtxs: { [key: string]: StepCtx }

	// in-disk / remote
	public execDocs: null | PouchDB.Database<ExecDoc>
	public scriptDocs: null | PouchDB.Database<ScriptDoc>
	private execDocsDSN: string
	private scriptDocsDSN: string

	constructor() {
		this.jScripts = {}
		this.jInsts = {}
		this.jExecs = {}
		this.jCtxs = {}
		this.sExecs = {}
		this.sCtxs = {}

		// init persistent storage delayed
		// set it to nulls for no op
		this.execDocs = null
		this.scriptDocs = null
	}

	initExecsRepo(dsn: string, opts?: any) {
		this.execDocs = new PouchDB<ExecDoc>(dsn, opts)
		this.execDocsDSN = dsn
	}
	async deinitExecsRepo() {
		// return await this.execDocs
	}

	initScriptsRepo(dsn: string, opts?: any) {
		this.scriptDocs = new PouchDB<ScriptDoc>(dsn, opts)
		this.scriptDocsDSN = dsn
	}
	async deinitScriptsRepo() { }

	async addScript(js: JobScript) {
		const record: ScriptDoc = { _id: js._id, content: js.fstr, ctime: js._ctime.toISOString(), fpath: js.fpath }
		this.jScripts[js._id] = js
		if (this.scriptDocs == null) {
			return
		}
		return await this.scriptDocs.put(record)
	}

	async updateScript(js: JobScript) {
		if (this.scriptDocs === null) {
			return
		}
		const doc = await this.scriptDocs.get(js._id)
		doc.ctime = new Date().toISOString()
		doc.content = js.fstr
		doc.fpath = js.fpath
		return await this.scriptDocs.put(doc)
	}

	async addExec(je: JobExec, instId?: string, steps?: string[]) {
		if (this.execDocs === null) {
			return
		}
		const obj: ExecDoc = {
			_id: je.id,
			ctime: je.updatedTime.toISOString(),
			jobName: je.jobName,
			btime: je.createTime.toISOString(),
			stime: je.startTime === null ? '' : je.startTime.toISOString(),
			instId: '',
			steps: [],
			status: je.batchStatus
		}
		if (instId) {
			obj.instId = instId
		}
		if (steps) {
			for (const s of steps) {
				obj.steps.push({[s]: null})
			}
		}
		this.execDocs.put(obj)
	}

	async addStepExec(se: StepExec) {}

	async updateExec(je: JobExec) {
		if (this.jExecs === null) {
			return
		}
	}

	async getStepPerstData(execId: string, stepId: string): Promise<any> {
		if ( this.execDocs === null ) {
			return null
		}
		const doc = await this.execDocs.get(execId)
		return doc.steps[stepId]
	}

	async close() {
	}
}
