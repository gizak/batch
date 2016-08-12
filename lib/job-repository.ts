import {Datastore, NullStore} from './datastore'
import {NeDB} from './datastores/nedb'
import * as fs from 'fs'
import * as path from 'path'

export class JobRepository {
	protected options: any
	protected jobs: Datastore
	protected logs: Datastore
	protected jobInsts: Datastore
	protected jobExecs: Datastore
	protected stepExecs: Datastore
	private counter: number
	constructor(opts: any) {
		this.counter = 0
		this.options = opts
		this.options.jobs = opts.jobs || {}
		this.options.logs = opts.logs || {}
		this.options.jobInsts = opts.jobInsts || {}
		this.options.jobExecs = opts.jobExecs || {}
		this.options.stepExecs = opts.stepExecs || {}
	}

	getDatastore(name: string): Datastore {
		if ('nedb' === name) {
			return new NeDB()
		}

		return new NullStore()
	}

	newId(): number{
		return this.counter++
	}
	init(): Promise<any> {
		return Promise.all(['jobs','logs','jobInsts','jobExecs','stepExecs'].map(v => {
			this[v] = this.getDatastore(this.options[v].datastore)
			return this[v].open(this.options[v].uri,this.options[v].options)
		}))
	}

	addJob(jobfile: string): Promise<string> {
		return new Promise((resolve, reject) => {
			fs.access(jobfile, fs.R_OK, err => {
				if (err) reject(err)
				else {
					const job = require(jobfile)
					const jobCfg = { _id: job.id, id: job.id, path: path.resolve(jobfile), _added: Date.now() }
					this.jobs.insert(jobCfg).then(id => resolve(id) ).catch(err => reject(err))
				}
			})
		})
	}

	getJob(jobid: string): Promise<any> {
		return new Promise((resolve, reject) => {
			this.jobs.find({ _id: jobid }).then( docs => {
					if (docs) resolve(docs[0])
					else resolve(null)
			}).catch( err => reject(err))
		})
	}

	addJobInstance(jobid: string): Promise<number> {
		return this.getJob(jobid).then(job => {
			if (!job) {
				throw new Error("Job "+jobid+"non-exists")
			}
			return this.newId()
		}).then((n: number) => {
			return this.jobInsts.insert({id:n, job: jobid, status: 'CREATED'}).then(()=>{
				return n
			})
		})
	}

	getJobIds(): Promise<string[]> {
		return new Promise((resolve, reject) => {
			this.jobs.find({}).then( docs=> { resolve(docs.map(o => { return o.id })) })
		})
	}
}