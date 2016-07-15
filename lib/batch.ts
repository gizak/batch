import {JobOperator} from './job-operator'
import {JobRepository} from './job-repository'

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

	public static getJobRepository() {
		if(!BatchRuntime.repo) {
			BatchRuntime.repo = new JobRepository('batch-db.json')
		}
		return BatchRuntime.repo
	}

	public static getJobOperator(): JobOperator {
		return new JobOperator()
	}
}