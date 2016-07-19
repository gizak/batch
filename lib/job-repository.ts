import * as Datastore from 'nedb'

export class JobRepository {
	protected db: Datastore
	protected jobs: Datastore
	protected logs: Datastore
	protected jobInsts: Datastore
	protected jobExecs: Datastore
	protected stepExecs: Datastore

	constructor(filename?: string) {
		this.db = new Datastore()
		this.jobs = new Datastore()
		this.logs = new Datastore()
		this.stepExecs = new Datastore()
	}

	addJob(job: any): Promise<string> {
		return new Promise((resolve, reject) => {
			this.jobs.insert(job, err => { if (err) reject(err); else resolve(job.id) })
		})
	}

	getJobIds(): Promise<string[]> {
		return new Promise((resolve, reject) => {
			this.jobs.find({}, { id: 1 }, (err, docs: any[]) => { resolve(docs.map(o => { return o.id })) })
		})
	}
}