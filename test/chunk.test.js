/*global describe:true, it:true, console:true, expect:true*/
/*eslint no-undef: "warn"*/

const ck = require('../build/chunk')

const chunk = {
	reader: {
		open() { 'open' },
		after() {}
	},
	writer: {},
	itemCount: 'chunk'
}

describe('chunk',()=>{
	const chunkp = ck.newChunkProxy(chunk)
	it('can access prop on origin object',()=>{
		expect(chunkp.itemCount).toBe(chunk.itemCount)
		expect(chunkp.reader.open).toBe(chunk.reader.open)
	})
	it('can access prop on proxy', ()=>{
		expect(chunkp.processor).toBeDefined()
		expect(chunkp.processor.before).toBeDefined()
	})
	it('can access prop on sub object proxy', ()=>{
		expect(chunkp.reader.before).toBeDefined()
		expect(chunkp.writer.before).toBeDefined()
	})
})