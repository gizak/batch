declare var jest, describe, it, expect

import { newChunkProxy } from '../lib/chunk'

const chunk = {
	reader: {
		open() { 'open' },
		after() { }
	},
	writer: {},
	itemCount: 'chunk'
}

describe('chunk', () => {
	it('can init with null', () => {
		newChunkProxy(null)
	})
	const chunkp = newChunkProxy(chunk)
	it('can access prop on origin object', () => {
		expect(chunkp.itemCount).toBe(chunk.itemCount)
		expect(chunkp.reader.open).toBe(chunk.reader.open)
	})
	it('can access prop on proxy', () => {
		expect(chunkp.processor).toBeDefined()
		expect(chunkp.processor.before).toBeDefined()
		expect(chunkp.reader.readItem()).toBe(null)
		expect(chunkp.processor.processItem(1)).toBe(1)
	})
	it('can access prop on sub object proxy', () => {
		expect(chunkp.reader.before).toBeDefined()
		expect(chunkp.writer.before).toBeDefined()
	})
})