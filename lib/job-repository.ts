import {Datastore, NullStore} from './datastore'
import {NeDB} from './datastores/nedb'
import * as fs from 'fs'
import * as path from 'path'
import {BatchStatus} from './runtime'
import {JobInstance} from './job-instance'
import * as Debug from 'debug'

const debug = Debug('JobRepository')

export class JobRepository {
	protected options: any
	protected jobs: Datastore
	protected logs: Datastore
	protected jobInsts: Datastore
	protected jobExecs: Datastore
	protected stepExecs: Datastore
	protected counter: number

	protected ctJobInsts: {[key: string]: JobInstance}

	constructor(opts: any) {
		this.ctJobInsts = {}
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

		debug('Return NullStore for %s', name)
		return new NullStore()
	}

	newId(): number {
		return this.counter++
	}
	init(): Promise<any> {
		return Promise.all(['jobs', 'logs', 'jobInsts', 'jobExecs', 'stepExecs'].map(v => {
			this[v] = this.getDatastore(this.options[v].datastore)
			debug('Init datastore %s with %s', v, this.options[v].datastore)
			return this[v].open(this.options[v].uri, this.options[v].options)
		}))
	}

	addJob(jobfile: string): Promise<string> {
		return new Promise((resolve, reject) => {
			fs.access(jobfile, fs.R_OK, err => {
				if (err) reject(err)
				else {
					const job = require(jobfile)
					const jobCfg = { _id: job.id, id: job.id, path: path.resolve(jobfile), _added: Date.now() }
					debug('Add job %s at %s', jobCfg.id, jobCfg.path)
					this.jobs.insert(jobCfg).then(id => resolve(id)).catch(err => reject(err))
				}
			})
		})
	}

	getJob(jobid: string): Promise<any> {
		return new Promise((resolve, reject) => {
			this.jobs.find({ _id: jobid }).then(docs => {
				if (docs) resolve(docs[0])
				else resolve(null)
			}).catch(err => reject(err))
		})
	}

	regJobInstance(jobid: string): Promise<string> {
		return this.getJob(jobid).then(job => {
			if (!job) {
				throw new Error(`Job ${jobid} non-exists`)
			}
		}).then(() => {
			debug('Register job instance %s', jobid)
			return this.jobInsts.insert({ job: jobid, status: BatchStatus.STARTING, _added: Date.now() })
		})
	}

	addJobInstance(ji: JobInstance): JobInstance {
		debug('Add job %s instance %s to .ctJobInsts', ji.getJobName(), ji.getInstanceId())
		this.ctJobInsts[ji.getInstanceId()] = ji
		return ji
	}

	getJobInstance(jiid: string): JobInstance {
		return this.ctJobInsts[jiid]
	}

	getJobIds(): Promise<string[]> {
		return new Promise((resolve, reject) => {
			this.jobs.find({}).then(docs => { resolve(docs.map(o => { return o.id })) })
		})
	}

	_dumpAll(): Promise<any> {
		debug('Dump .ctJobInsts:')
		debug(this.ctJobInsts)

		return Promise.all(['jobs', 'logs', 'jobInsts', 'jobExecs', 'stepExecs'].map(v => {
			return this[v].find({}).then(data => {
				debug('Dump .%s:', v)
				debug(data)
			})
		}))
	}
}