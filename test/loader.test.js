const loader = require('../build/loader')

describe('loader', ()=>{
	it('can pass syntax check', ()=>{
		const vms = loader.newVMScript('./test/job1.js')
		const jip = loader.newJobInst(vms)
		console.log(jip.RUNTIME)
	})
})