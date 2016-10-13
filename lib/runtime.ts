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

	static init(opts: {scripts: {dsn: string}, execs:  {dsn: string}, steps: {dsn: string}}) {
		Runtime._opts = opts
		Runtime.db = new Repo()
		Runtime.db.initScriptsRepo(opts.scripts.dsn, {})
	}
}