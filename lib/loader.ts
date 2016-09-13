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

// synchronously load and compile Job.
export function newVMScript(fpath: string): vm.Script {
	const abspath = path.resolve(fpath)
	const fstr = fs.readFileSync(abspath, 'utf-8')
	const opts = {filename: abspath, lineOffset: 0, columnOffset: 0, displayErrors: true}
	const meta = {_id: shortid.generate(), _ctime: new Date()}
	const script = new Proxy(new vm.Script(fstr, opts), {get(target, prop, receiver) {
		if ( prop in meta ) {
			return meta[prop]
		}
		return Reflect.get(target, prop, receiver)
	}})
	return new vm.Script(fstr, opts)
}

// init job context/exec, runtime uid
export function newJobInst(script: vm.Script): Job {
	const _module = {
		exports: {}
	}
	const share = {
		require: require,
		module: _module,
		exports: _module.exports,
		RUNTIME: {jobContext: null, stepContext: null}
	}

	const je = new JobExec()
	const jc = new JobCtx()
	share.RUNTIME.jobContext = jc

	const context = vm.createContext(share)

	// import 
	script.runInContext(context)
	const job = _module.exports

	// validate & setup

	// proxy
	const handler = {
		get(target, prop, receiver) {
			if (prop === 'RUNTIME') {
				return share.RUNTIME
			}
			return Reflect.get(target, prop, receiver)
		}
	}
	const jobp = new Proxy(new Job(), handler)
	jobp.RUNTIME._bind(script, jobp)
	return jobp
}