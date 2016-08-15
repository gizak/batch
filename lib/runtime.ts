import {JobOperator} from './job-operator'
import {JobRepository} from './job-repository'
import * as Koa from 'koa'
import * as Debug from 'debug'
import * as Router from 'koa-router'
import * as Events from 'events'

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

const debug = Debug('BatchRuntime')

/**
 * BatchRuntime
 */
export class BatchRuntime {
	private static repo: JobRepository
	private static evtHub: Events.EventEmitter

	public static initEventHub(): void {
		BatchRuntime.evtHub = new Events.EventEmitter()
	}

	public static initRepository(opts: any): Promise<void> {
		BatchRuntime.repo = new JobRepository(opts)
		debug('Init repo with options:')
		debug(opts)
		return BatchRuntime.repo.init()
	}

	public static getJobRepository() {
		if (!BatchRuntime.repo) {
			throw new Error('Repository is not intialized')
		}
		return BatchRuntime.repo
	}

	public static getJobOperator(): JobOperator {
		return new JobOperator()
	}

	public static emit(event: string, ...rest): boolean {
		return BatchRuntime.evtHub.emit(event, ...rest)
	}

	public static on(event: string, listener: Function): Events.EventEmitter {
		return BatchRuntime.evtHub.on(event, listener)
	}
}