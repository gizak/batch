declare var jest, describe, it, expect

import { Runtime } from '../build/runtime'

describe('operator', () => {
	let op = undefined
	it('is obtainable', () => {
		Runtime.init({ scripts: { dsn: 'batchdb/scripts' }, execs: { dsn: 'batchdb/execs' }})
		op = Runtime.operator
		expect(op).toBeDefined()
		expect(op).toBe(Runtime.operator)
	})
	it('can add JobScript', async () => {
		const js = await op._loadJobScriptFromFile('test/job1.js')
		expect(js).toBeDefined()

		const ji = op._newJobInst(js)
		expect(ji).toBeDefined()
		expect(Object.keys(Runtime.db.jInsts).length).toBe(1)

		const je = op._newJobExec(ji)
		expect(je).toBeDefined()
		expect(Object.keys(Runtime.db.jExecs).length).toBe(1)

		const jc = op._newJobCtx(ji, je)
		expect(jc).toBeDefined()
		expect(Object.keys(Runtime.db.jCtxs).length).toBe(1)
	})
})