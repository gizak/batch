declare var jest, describe, it, expect

import { Runtime } from '../build/runtime'

Runtime.init({})

describe('operator', () => {
	let op
	it('obtainable',()=>{
		op = Runtime.operator
		expect(op).toBeTruthy()
	})
})