import {Job, JobCtx, JobExec} from './job'
import {StepCtx, StepExec} from './step'

export class Repository {
	public jobCtxs: JobCtx[]
	public jobInsts: Job[]
	public jobExecs: JobExec[]
	public stepCtxs: StepCtx[]
	public stepExecs: StepExec[]

	constructor() {
		this.jobCtxs = []
		this.jobInsts = []
		this.jobExecs = []
		this.stepCtxs = []
		this.stepExecs = []
	}
}