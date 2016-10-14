declare var jest, describe, it, expect

import { newObjProxy } from '../build/helpers'

describe('helper', () => {
	it('newObjProxy accessible', () => {
		const obj = { a: null, b: undefined, c: 'c', d: [] }
		const shadow = { a: 'a', b: 'b', c: 'c', d: 'd', e: 'e' }
		const objp = newObjProxy(obj, shadow)
		expect(objp.a).toBe(null)
		expect(objp.b).toBe('b')
		expect(objp.c).toBe('c')
		expect(objp.d).toBe(obj.d)
		expect(objp.e).toBe('e')
	})
})