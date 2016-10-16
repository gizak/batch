import { Operator } from './operator'
import { Repo } from './repository'
import { Status } from './status'

export class Runtime {
	private static db: Repo
	private static _op: Operator | null
	private static _opts: any
	static get operator(): Operator {
		if (!Runtime._op) {
			Runtime._op = new Operator(Runtime.db)
		}
		return Runtime._op
	}

	static init(opts: {db?: { scripts?: { dsn: string }, execs?: { dsn: string }, steps?: { dsn: string } }}) {
		if (opts.db) {
			Runtime.initStore(opts.db)
		}
	}

	static initStore(opts: { scripts?: { dsn: string, opts?: any }, execs?: { dsn: string, opts?: any }, steps?: { dsn: string, opts?: any } }) {
		Runtime._opts = opts
		Runtime.db = new Repo()

		// scripts
		if (opts.scripts) {
			Runtime.db.initScriptsRepo(opts.scripts.dsn, opts.scripts.opts)
		} else {
			Runtime.db.initScriptsRepo('scipts', {db: require('memdown')})
		}

		// execs
		if (opts.execs) {
			Runtime.db.initExecsRepo(opts.execs.dsn, opts.execs.opts)
		} else {
			Runtime.db.initScriptsRepo('execs', {db: require('memdown')})
		}

		// steps
		if (opts.steps) {
			Runtime.db.initStepsRepo(opts.steps.dsn, opts.steps.opts)
		} else {
			Runtime.db.initScriptsRepo('steps', {db: require('memdown')})
		}
	}

	static _dumpDB() {
		Runtime.db._dump()
	}
}