import {Job, JobContext, JobExec} from './job'
import {StepContext} from './step'

export class Repository {
	public jobCtx: JobContext[]
	public jobInsts: Job[]
	public jobExecs: JobExec[]
	public StepCtx: StepContext[]

	constructor() {
		this.jobCtx = []
		this.jobInsts = []
		this.jobExecs = []
		this.StepCtx = []
	}
}