declare var jest, describe, it, expect

import { Runtime } from '../build/runtime'

describe('runtime', () => {
	it('can get JobOperator', () => {
		Runtime.operator
	})
})
