import { Step, StepCtx } from './step'
import { JobCtx } from './job-context'
import * as shortid from 'shortid'
import * as fs from 'fs'
import * as vm from 'vm'
import * as path from 'path'

export class Job {
	public id: string
	public steps: Step[]
	public restartable: boolean

	public before() {}
	public after() {}

	// proxy stub
	public RUNTIME: JobRuntime

	constructor() {
		this.id = ''
		this.steps = []
		this.restartable = false
	}
}

export class JobRuntime {
	public id: string
	public jobContext: JobCtx
	public stepContext: {[step: string]: StepCtx}
}

// synchronously load and compile Job.
export function newVMScript(fpath: string): vm.Script {
	const abspath = path.resolve(fpath)
	const fstr = fs.readFileSync(abspath, 'utf-8')
	return new vm.Script(fstr, {filename: abspath, lineOffset: 0, columnOffset: 0, displayErrors: true})
}

// init job context, runtime uid
export function newJobInst(script: vm.Script): Job {
	const _module = {
		exports: {}
	}
	const share = {
		require: require,
		module: _module,
		exports: _module.exports,
		RUNTIME: new JobRuntime()
	}
	const context = vm.createContext(share)

	// import 
	script.runInContext(context)
	const job = _module.exports

	// validate

	// proxy
	const handler = {}
	const jobp = new Proxy(new Job(), handler)
	return jobp
}