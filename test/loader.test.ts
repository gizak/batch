declare var jest, describe, it, expect

import { newVMScriptFromFile, newRawJob, newJobInst, _newJobInst } from '../build/loader'

describe('loader', () => {
	let rt = undefined
	let jctx = undefined
	let vms = undefined
	let jip = undefined
	let job = undefined

	it('loads script from disk', () => {
		vms = newVMScriptFromFile('test/job1.js')
		expect(vms._id).toBeDefined()
		job = newRawJob(vms)
		rt = {}
		jip = newJobInst(job, rt)
	})
	it('can have job script access own prop and ext RUNTIME', () => {
		rt = jip.RUNTIME
		expect(rt).toBeDefined()
		expect(jip.id).toBe('testjob')
	})
	it('can call hook', () => {
		jip.before()
		jip.after()
	})
	it('can inject contexts', () => {
		rt.jobContext = {}
		jctx = jip.RUNTIME.jobContext
		expect(jctx).toBeDefined()
		//console.log(rt.stepContext)
	})
	it('can proxy calls', () => {
		expect(jip.steps[0].chunk.before).toBeDefined()
		expect(jip.steps[0].id).toBe('step1')
	})
	it('throws on bad script', () => {
		const vms2 = newVMScriptFromFile('test/job2.js')
		expect(() => _newJobInst(vms2)).toThrow()
	})
})
