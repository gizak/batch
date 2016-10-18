declare var jest, describe, it, expect

import { Runtime } from '../build/runtime'

Runtime.init({db: {}}) // in-mem

describe('operator', () => {
	let op
	let js
	it('obtainable',()=>{
		op = Runtime.operator
		expect(op).toBeTruthy()
	})

	it('loads job file', async ()=>{
		js = await op._loadJobScriptFromFile('test/job1.js')
		expect(js).toBeTruthy()
		const ji = op._newJobInst(js)
		expect(ji).toBeTruthy()
		ji.RUNTIME.o = {x:2}
		expect(ji.RUNTIME.o.x).toBe(2)
		const je = await op._newJobExec(ji)
		expect(je).toBeTruthy()
		const jc = op._newJobCtx(ji,je)
		expect(jc).toBeTruthy()
	})

	it('supports query', async ()=>{
		const ji = op._newJobInst(js) // now 2 insts
		const je = await op._newJobExec(ji)
		const je2 = await op._newJobExec(ji) // two execs
		expect(op.jobNames.length).toBe(1)
		const [jname] = op.jobNames
		expect(op.jobInsts(jname).length).toBe(2)
		expect(op.jobInstCount(jname)).toBe(2)
		expect(op.runningExecs(jname).length).toBe(3)
	})

	it('starts job', async () => {
		try {
		const eid = await op.start('test/job1.js')
		expect(eid).toBeTruthy()
		expect(op.jobNames.length).toBe(1)
		const [jname] = op.jobNames
		expect(op.jobInsts(jname).length).toBe(3)
		expect(op.jobInstCount(jname)).toBe(3)
		expect(op.runningExecs(jname).length).toBe(4)
		} catch ( err ) { expect(err).toBeFalsy(); throw err}
	})
})