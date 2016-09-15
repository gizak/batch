/*global describe:true, it:true, console:true, expect:true*/
/*eslint no-undef: "warning"*/

const loader = require('../build/loader')

describe('loader', ()=>{
	let rt = undefined
	let jctx = undefined
	let vms = undefined
	let jip = undefined

	it('can compile', ()=>{
		vms = loader.newVMScript('./test/job1.js')
		jip = loader.newJobInst(vms)
	})
	it('can have job script access own prop and ext RUNTIME', () => {
		rt = jip.RUNTIME
		expect(rt).toBeDefined()
		expect(jip.id).toBe('testjob')
	})
	it('can call hook',()=> {
		jip.before()
		jip.after()
	})
	it('can inject contexts',() => {
		jctx = jip.RUNTIME.jobContext
		expect(jctx).toBeDefined()
	})
})