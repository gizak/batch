declare var jest, describe, it, expect

import { Runtime } from '../lib/runtime'

describe('operator', () => {
	let op = undefined
	it('is obtainable', () => {
		Runtime.init({ scripts: { dsn: 'batchdb/scripts' } })
		op = Runtime.operator
		expect(op).toBeDefined()
		expect(op).toBe(Runtime.operator)
	})
	it('can add JobScript', () => {
		op._loadJobScriptFromFile('test/job1.js').then(js => {
			expect(js).toBeDefined()

			const ji = op._newJobIns(js)
			expect(ji).toBeDefined()
			expect(Runtime.db.jInsts.keys().length).toBe(1)

			const je = op._newJobExec(ji)
			expect(je).toBeDefined()
			expect(Runtime.db.jExecs.keys().length).toBe(1)

			const jc = op._newJobCtx(ji, je)
			expect(jc).toBeDefined()
			expect(Runtime.db.jCtxs.keys().length).toBe(1)

		}).catch(err => {
			console.log(err)
		})
	})
})