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
	steps: string[] | null
}

interface StepExecDoc {
	_id: string
	name: string
	execId: string
	_rev?: string
	perstData: any
	chkPtData: any
	status: Status
	exitStatus: string
}

interface ScriptDoc {
	_id: string
	_rev?: string
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
	public stepDocs: null | PouchDB.Database<StepExecDoc>
	public scriptDocs: null | PouchDB.Database<ScriptDoc>
	private execDocsDSN: string
	private stepDocsDSN: string
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
		this.scriptDocs = null
	}

	initExecsRepo(dsn: string, opts?: any) {
		this.execDocs = new PouchDB<ExecDoc>(dsn, opts)
		this.execDocsDSN = dsn
	}

	initScriptsRepo(dsn: string, opts?: any) {
		this.scriptDocs = new PouchDB<ScriptDoc>(dsn, opts)
		this.scriptDocsDSN = dsn
	}

	initStepsRepo(dsn: string, opts?: any) {
		this.stepDocs = new PouchDB<StepExecDoc>(dsn, opts)
		this.stepDocsDSN = dsn
	}

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

	private _newExecDoc(je: JobExec, instId?: string): ExecDoc {
		const obj: ExecDoc = {
			_id: je.id,
			ctime: je.updatedTime.toISOString(),
			jobName: je.jobName,
			btime: je.createTime.toISOString(),
			stime: je.startTime === null ? '' : je.startTime.toISOString(),
			instId: '',
			steps: null,
			status: je.batchStatus
		}
		if (instId) {
			obj.instId = instId
		}
		return obj
	}

	async addExec(je: JobExec, instId?: string, steps?: string[]) {
		if (this.execDocs === null) {
			return
		}
		this.execDocs.put(this._newExecDoc(je, instId))
	}

	async addStepExec(se: StepExec) {
		const doc: StepExecDoc = {
			_id: se.stepExecId,
			execId: se.execId,
			name: se.stepName,
			status: se.batchStatus,
			exitStatus: se.exitStatus,
			chkPtData: null,
			perstData: null
		}
	}

	async getChkPtData(sid: string): Promise<any> {
		if (this.stepDocs === null ) {
			return
		}
		const doc = await this.stepDocs.get(sid)
		return doc.chkPtData
	}

	async setChkPtData(sid: string, data: any) {
		if (this.stepDocs === null ) {
			return
		}
		const doc = await this.stepDocs.get(sid)
		doc.chkPtData = data
		return await this.stepDocs.put(doc)
	}

	async updateExec(je: JobExec) {
		if (this.jExecs === null) {
			return
		}
	}

	async setStepPerstData(sid: string, data: any) {
		if (this.stepDocs === null ) {
			return
		}
		const doc = await this.stepDocs.get(sid)
		doc.perstData = data
		return await this.stepDocs.put(doc)
	}

	async getStepPerstDataByExec(execId: string, stepIdx: number): Promise<any> {
		if ( this.execDocs === null ) {
			return null
		}
		const doc = await this.execDocs.get(execId)
		if (doc.steps == null ) {
			return null
		}
		const sid = doc.steps[stepIdx]
		return await this.getStepPerstData(sid)
	}

	// sid: _id
	async getStepPerstData(sid: string): Promise<any> {
		if ( this.stepDocs === null ) {
			return null
		}
		return await this.stepDocs.get(sid)
	}

	async close() {
	}
}