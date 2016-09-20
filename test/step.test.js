/*global describe:true, it:true, console:true, expect:true*/
/*eslint no-undef: "warn"*/

const step = require('../build/step')
const stepObj = {}

describe('step', ()=>{
	const stepp = step.newStepProxy(stepObj)
	it('can access origin prop',()=>{
		stepObj.id = 'step'
		expect(stepp.id).toBe(stepObj.id)
	})
	it('can fill default prop', ()=>{
		expect(stepp.before).toBeDefined()
	})
	it('can access chunk', ()=>{
		expect(stepp.chunk).toBe(null)
		stepObj.chunk = {itemCount: 1}
		expect(step.chunk).not.toBe(null)
	})
})