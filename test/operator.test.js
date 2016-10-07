/*global describe:true, it:true, console:true, expect:true*/
/*eslint no-undef: "warn"*/
/*eslint-dsiable no-console */

rt = require('../build/runtime')

describe('operator',()=>{
	let op = undefined
	it('is obtainable', ()=>{
		op = rt.operator
		expect(op).toBe(rt.operator)
	})
	it('can add JobScript', ()=>{
		
	})
})