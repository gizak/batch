import {Job, JobContext} from './job'
import {StepContext} from './step'

export class Repository {
	public jobCtx: JobContext[]
	public jobInsts: Job[]
	public jobExecs
	public ExecCtx
	public StepCtx: StepContext[]
}