import { Chunk } from './chunk'
import { Batchlet } from './batchlet'

export class Step {
	public id: string
	public chunk?: Chunk
	public batchlet?: Batchlet

	public before() {}
	public after() {}

	constructor() {
		this.chunk = null
		this.batchlet = null
		this.id = null
	}
}