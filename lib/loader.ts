import { Step } from './step'
import { StepCtx } from './step-context'
import { JobCtx } from './job-context'
import { Job, newJobProxy } from './job'
import { JobExec } from './job-execution'
import { JobRuntime } from './job-runtime'
import * as shortid from 'shortid'
import * as fs from 'fs'
import * as vm from 'vm'
import * as path from 'path'

export class JobScript extends vm.Script {
	readonly _id: string
	_ctime: Date
	fpath: string
	fstr: string
	constructor(fpath: string, opts: any) {
		fpath = path.resolve(fpath)
		const fstr = fs.readFileSync(fpath, 'utf-8')
		super(fstr, opts)

		this._id = shortid.generate()
		this._ctime = new Date()
		this.fpath = fpath
		this.fstr = fstr

	}
}

// synchronously load and compile Job.
export function newVMScript(fpath: string): JobScript {
	const abspath = path.resolve(fpath)
	const opts = {filename: abspath, lineOffset: 0, columnOffset: 0, displayErrors: true}
	return new JobScript(abspath, opts)
}

// init job context/exec, runtime uid
// may throw error if job script is not validated
export function _newJobInst(script: JobScript): Job {
	const _module = {
		exports: {}
	}
	const share = {
		require: require,
		module: _module,
		exports: _module.exports,
		RUNTIME: {jobContext: {}, stepContext: {}}
	}

	const id = shortid.generate()
	// const je = new JobExec()

	const context = vm.createContext(share)

	// import 
	script.runInContext(context)
	const job: any = _module.exports

	// proxy
	const jobp = newJobProxy(job, share.RUNTIME)

	// validate & setup
	const jc = new JobCtx(job.id, script._id , id)
	share.RUNTIME.jobContext = jc
	for ( const s of jobp.steps ) {
		share.RUNTIME.stepContext[s.id] = null
	}

	// now all hooked up
	return jobp
}

export function newRawJob(script: JobScript): any {
	const _module = {
		exports: {}
	}
	const share = {
		require: require,
		module: _module,
		exports: _module.exports,
		RUNTIME: {jobContext: {}, stepContext: {}}
	}
	const context = vm.createContext(share)
	script.runInContext(context)
	return _module.exports
}

export function newJobInst(rawJob: any, runtimeObj: any): Job {
	const jobp = newJobProxy(rawJob, runtimeObj)
	return jobp
}