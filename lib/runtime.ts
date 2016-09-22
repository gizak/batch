import { Operator } from './operator'

export enum Status {STARTING, STARTED, STOPPING, STOPPED, FAILED, COMPLETED, ABANDONED}

export class Runtime {
	private static db: any

	static get operator(): Operator { return new Operator() }
}