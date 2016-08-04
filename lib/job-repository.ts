import {Datastore} from './datastore'
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

	constructor(opts: any) {
		this.options = opts
	}

	init(): Promise<void> {
		return Promise.resolve()
	}

	addJob(jobfile: string): Promise<string> {
		return new Promise((resolve, reject) => {
			fs.access(jobfile, fs.R_OK, err => {
				if (err) { reject(err) }
				else {
					const job = require(jobfile)
					const jobCfg = { _id: job.id, id: job.id, path: path.resolve(jobfile), _added: Date.now() }
					this.jobs.insert(jobCfg, (err, id) => {
						if (err) reject(err)
						else resolve(id)
					})
				}
			})
		})
	}

	getJob(jobid: string): Promise<any> {
		return new Promise((resolve, reject) => {
			this.jobs.find({ _id: jobid }, (err, docs) => {
				if (err) reject(err)
				else {
					if (docs) resolve(docs[0])
					else resolve(null)
				}
			})
		})
	}

	addJobInstance(jobid: string): Promise<string> {
		return new Promise((resolve, reject) => {
		})
	}

	getJobIds(): Promise<string[]> {
		return new Promise((resolve, reject) => {
			this.jobs.find({}, (err, docs: any[]) => { resolve(docs.map(o => { return o.id })) })
		})
	}
}