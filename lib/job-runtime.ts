import { JobCtx } from './job-context'
import { StepCtx } from './step-context'

export class JobRuntime {
	public id: string
	public jobContext: JobCtx
	public stepContext: {[step: string]: StepCtx}
}