/*global describe:true, it:true, console:true, expect:true*/
/*eslint no-undef: "warn"*/

const ctx = require('../build/job-context')

describe('JobContext', ()=>{
	it('can new instance',() => {
		const jctx = new ctx.JobCtx('jname','instId','execId')
		
		expect(jctx).toBeDefined()
		// readonly Id
		expect(jctx.executionId).toBe('execId')
		// default exit status
		expect(jctx.exitStatus).toBe('STARTING')
		// user data
		jctx.transientUserData = 'user data'
		expect(jctx.transientUserData).toBe('user data')
		// set exit status
		jctx.exitStatus = 'omg'
		expect(jctx.exitStatus).toBe('omg')

	})
})