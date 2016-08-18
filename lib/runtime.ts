import * as PouchDB from 'pouchdb'
import * as bunyan from 'bunyan'
import {Operator} from './operator'
import {Repository} from './runtime/repository'

export class Runtime {
	private static db: PouchDB.Database<{}>
	private static repo: Repository
	private static log: bunyan.Logger
	private static opts: any

	static init(opt: any) {
		opt.store = opt.store || {}
		opt.log = opt.log || {}

		const dbn: string = opt.store.name || 'batch.db'
		const dbOpts: any  = opt.store.options || {}
		const logOpts: any = opt.log
		logOpts.name = logOpts.name || 'batch'
		Runtime.db = new PouchDB(dbn, dbOpts)
		Runtime.log = bunyan.createLogger(logOpts)

		Runtime.opts = opt
		Runtime.repo = new Repository()
		Runtime.log.info('Runtime initialized')
	}

	static jobOperator(): Operator {
		return new Operator(Runtime.db, Runtime.log, Runtime.repo)
	}

	static deinit() {}
}