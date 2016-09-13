import { Step } from './step'
import { StepCtx } from './step-context'
import { JobCtx } from './job-context'
import { JobRuntime } from './job-runtime'

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