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

	addJob(jobfile: string): Promise<string> {
		return new Promise((resolve, reject) => {
			const job = require(jobfile)
			const jobCfg = {_id: job.id, id: job.id, path: jobfile, _added: Date.now()}

			this.jobs.insert(jobCfg, (err, newjob) => {
				if (err) reject(err)
				else resolve(newjob._id)
			})
		})
	}

	getJob(jobid: string): Promise<any> {
		return new Promise((resolve,reject)=>{
			this.jobs.find({_id:jobid},(err,doc)=>{
				if (err) reject(err)
				else if (doc) return resolve(doc[0])
			})
		})
	}

	addJobInstance(jobid: string): Promise<string> {
		return new Promise((resolve, reject)=>{
		})
	}

	getJobIds(): Promise<string[]> {
		return new Promise((resolve, reject) => {
			this.jobs.find({}, { id: 1 }, (err, docs: any[]) => { resolve(docs.map(o => { return o.id })) })
		})
	}
}