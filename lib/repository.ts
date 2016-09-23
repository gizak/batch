import * as PouchDB from 'pouchdb'
import { Job } from './job'
import { JobExec } from './job-execution'
import { JobCtx } from './job-context'
import { StepExec } from './step-execution'
import { StepCtx } from './step-context'
import { Status } from './runtime'
interface ExecDoc {
	_id: string
	_rev?: string
	ctime: string
	btime: string
	instId: string
	jobName: string
	status: Status
	steps: {[key: string]: StepExecDoc}[]
}

interface StepExecDoc {
	_id: string
	perstData: any
	chkPoint: any
	status: Status
	exitStatus: string
}

export class Repo {
	// in-memory
	public jInsts: {[key: string]: Job }
	public jExecs: {[key: string]: JobExec }
	public jCtxs: {[key: string]: JobCtx }
	public sExecs: {[key: string]: StepExec}
	public sCtxs: {[key: string]: StepCtx}

	// in-disk / remote
	public execDocs: PouchDB.Database<ExecDoc>
}