import {Job, JobContext, JobExec} from './job'
import {StepContext, StepExec} from './step'

export class Repository {
	public jobCtx: JobContext[]
	public jobInsts: Job[]
	public jobExecs: JobExec[]
	public stepCtx: StepContext[]
	public stepExecs: StepExec[]

	constructor() {
		this.jobCtx = []
		this.jobInsts = []
		this.jobExecs = []
		this.stepCtx = []
		this.stepExecs = []
	}
}