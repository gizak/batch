import { Step } from './step'
import { StepCtx } from './step-context'
import { JobCtx } from './job-context'
import { Job } from './job'
import { JobExec } from './job-execution'
import { JobRuntime } from './job-runtime'
import * as shortid from 'shortid'
import * as fs from 'fs'
import * as vm from 'vm'
import * as path from 'path'

export class JobScript extends vm.Script {
	readonly _id: string
	_ctime: Date

	constructor(fstr: string, opts: any) {
		super(fstr, opts)
		this._id = shortid.generate()
		this._ctime = new Date()
	}
}

// synchronously load and compile Job.
export function newVMScript(fpath: string): JobScript {
	const abspath = path.resolve(fpath)
	const fstr = fs.readFileSync(abspath, 'utf-8')
	const opts = {filename: abspath, lineOffset: 0, columnOffset: 0, displayErrors: true}

	return new JobScript(fstr, opts)
}

// init job context/exec, runtime uid
export function newJobInst(script: JobScript): Job {
	const _module = {
		exports: {}
	}
	const share = {
		require: require,
		module: _module,
		exports: _module.exports,
		RUNTIME: {jobContext: null, stepContext: null}
	}

	const id = shortid.generate()
	const je = new JobExec()

	const context = vm.createContext(share)

	// import 
	script.runInContext(context)
	const job: any = _module.exports

	// validate & setup
	const jc = new JobCtx(job.id, script._id , id)
	share.RUNTIME.jobContext = jc


	// proxy
	const handler = {
		get(target, prop, receiver) {
			if (prop === 'RUNTIME') {
				return share.RUNTIME
			}
			if (prop in job ) {
				return Reflect.get(job, prop, receiver)
			}
			return Reflect.get(target, prop, receiver)
		}
	}
	const jobp = new Proxy(new Job(), handler)

	return jobp
}