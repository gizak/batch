declare var jest, describe, it, expect

import { Runtime } from '../lib/runtime'

describe('runtime', () => {
	it('can get JobOperator', () => {
		Runtime.operator
	})
})
