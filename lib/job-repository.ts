import loki = require('lokijs')

export class JobRepository {
	protected db: Loki
	protected jobs: LokiCollection<Object>
	protected logs: LokiCollection<Object>
	protected jobInsts: LokiCollection<Object>
	protected jobExecs: LokiCollection<Object>
	protected stepExecs: LokiCollection<Object>

	constructor(filename: string) {
		this.db = new loki(filename)
		this.jobs = this.db.addCollection('jobs')
		this.logs = this.db.addCollection('logs')
		this.stepExecs = this.db.addCollection('steps')
	}
}