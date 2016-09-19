/*global describe:true, it:true, console:true, expect:true*/
/*eslint no-undef: "warn"*/
const helpers = require('../build/helpers')

describe('helper', ()=>{
	it('newObjProxy accessible',()=>{
		const obj = {a: null, b: undefined, c: 'c', d: []}
		const shadow = {a: 'a', b: 'b', c: 'c',d : 'd', e: 'e'}
		objp = helpers.newObjProxy(obj, shadow)
		expect(objp.a).toBe(null)
		expect(objp.b).toBe('b')
		expect(objp.c).toBe('c')
		expect(objp.d).toBe(obj.d)
		expect(objp.e).toBe('e')
	})
})