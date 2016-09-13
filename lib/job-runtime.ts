import { Job } from './job'
import { JobCtx } from './job-context'
import { StepCtx } from './step-context'
import * as shortid from 'shortid'
import * as vm from 'vm'

export class JobRuntime {
	private _id: string
	private _inst: Job
	private _script: vm.Script
	public jobContext: JobCtx
	public stepContext: {[step: string]: StepCtx}

	constructor() {
		this._id = shortid.generate()
	}

	_bind(script: vm.Script, inst: Job) {
		this._inst = inst
		this._script = script
	}
}