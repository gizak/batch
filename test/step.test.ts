declare var jest, describe, it, expect

import { newStepProxy } from '../build/step'
const stepObj = {}

describe('step', () => {
	let stepp = newStepProxy(stepObj)
	it('can access origin prop', () => {
		stepObj.id = 'step'
		expect(stepp.id).toBe(stepObj.id)
	})
	it('can fill default prop', () => {
		expect(stepp.before).toBeDefined()
	})
	it('can access chunk', () => {
		expect(stepp.chunk).toBe(undefined)
		stepObj.chunk = { itemCount: 1 }
		stepObj.chunk.reader = {
			open() { },
			before() { }
		}
		stepp = newStepProxy(stepObj)
		expect(stepp.chunk).not.toBe(null)
		expect(stepp.chunk.itemCount).toBe(1)
		expect(stepp.chunk.processor.before).toBeDefined()
		expect(stepp.chunk.reader.open).toBe(stepObj.chunk.reader.open)
	})
})