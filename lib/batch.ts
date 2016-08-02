import {JobOperator} from './job-operator'
import {JobRepository} from './job-repository'
import * as Koa from 'koa'
import * as Debug from 'debug'
import * as Router from 'koa-router'

export enum BatchStatus {
	STARTING,
	STARTED,
	STOPPING,
	STOPPED,
	FAILED,
	COMPLETED,
	ABANDONED
}

export enum MetricType {
	READ_COUNT,
	WRITE_COUNT,
	COMMIT_COUNT,
	FILTER_COUNT,
	ROLLBACK_COUNT,
	READ_SKIP_COUNT,
	PROCESS_SKIP_COUNT,
	WRITE_SKIPCOUNT
}

/**
 * BatchRuntime
 */
export class BatchRuntime {
	private static repo: JobRepository

	public static init(): Koa {
		const debug = Debug('app')
		const app = new Koa()
		const router = new Router()
		const jop = BatchRuntime.getJobOperator()

		jop.initRepository()

		router.get('/jobs', function *(next){
			const jbs = yield jop.lsJobs()
			this.body = JSON.stringify(jbs)
			yield next
		})

		app.use(router.routes())
		app.use(router.allowedMethods())
		return app
	}

	public static getJobRepository() {
		if (!BatchRuntime.repo) {
			BatchRuntime.repo = new JobRepository()
		}
		return BatchRuntime.repo
	}

	public static getJobOperator(): JobOperator {
		return new JobOperator()
	}
}