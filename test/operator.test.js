/*global describe:true, it:true, console:true, expect:true*/
/*eslint no-undef: "warn"*/
/*eslint-dsiable no-console */

rt = require('../build/runtime')

describe('operator',()=>{
	let op = undefined
	it('is obtainable', ()=>{
		rt.Runtime.init({scripts: {dsn:'batchdb/scripts'}})
		op = rt.Runtime.operator
		expect(op).toBeDefined()
		expect(op).toBe(rt.Runtime.operator)
	})
	it('can add JobScript', ()=>{
		op._loadJobScriptFromFile('test/job1.js').then( js => {		
			expect(js).toBeDefined()

			const ji = op._newJobIns(js)
			expect(ji).toBeDefined()
			expect(rt.Runtime.db.jInsts.keys().length).toBe(1)
		
			const je = op._newJobExec(ji)
			expect(je).toBeDefined()
			expect(rt.Runtime.db.jExecs.keys().length).toBe(1)

			const jc = op._newJobCtx(ji,je)
			expect(jc).toBeDefined()
			expect(rt.Runtime.db.jCtxs.keys().length).toBe(1)

		}).catch(err => {
			console.log(err)
		})
	})
})