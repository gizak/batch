/*global describe:true, it:true, console:true, expect:true*/
/*eslint no-undef: "warn"*/

const step = require('../build/step')
const stepObj = {}

describe('step', ()=>{
	let stepp = step.newStepProxy(stepObj)
	it('can access origin prop',()=>{
		stepObj.id = 'step'
		expect(stepp.id).toBe(stepObj.id)
	})
	it('can fill default prop', ()=>{
		expect(stepp.before).toBeDefined()
	})
	it('can access chunk', ()=>{
		expect(stepp.chunk).toBe(undefined)
		stepObj.chunk = {itemCount: 1}
		stepObj.chunk.reader = {
			open(){},
			before(){}
		}
		stepp = step.newStepProxy(stepObj)	
		expect(stepp.chunk).not.toBe(null)
		expect(stepp.chunk.itemCount).toBe(1)
		expect(stepp.chunk.processor.before).toBeDefined()
		expect(stepp.chunk.reader.open).toBe(stepObj.chunk.reader.open)
	})
})