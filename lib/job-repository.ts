import * as loki from 'lokijs'

export class JobRepository {
	protected db: Loki
	protected jobs
	protected logs
	protected jobInsts
	protected jobExecs
	protected stepExecs

	constructor(filename?: string) {
		this.db = new loki(filename)
		this.jobs = this.db.addCollection('jobs')
		this.logs = this.db.addCollection('logs')
		this.stepExecs = this.db.addCollection('steps')
	}

	addJob(job: Object) {
		this.jobs.insert(job)
	}

	getJobIds(): string[] {
		return this.jobs.data.map((obj): string => {return obj.id})
	}
}