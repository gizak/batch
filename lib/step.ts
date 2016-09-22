import { Chunk, newChunkProxy } from './chunk'
import { Batchlet } from './batchlet'

export class Step {
	public id: string
	public chunk?: Chunk
	public batchlet?: Batchlet

	public before() {}
	public after() {}

	constructor() {
		this.id = ''
	}
}

export function newStepProxy(step: any): Step {
	const chunkp = newChunkProxy(step.chunk)
	const blankStep = new Step()
	const handler = {
		get(target, prop, receiver) {
			if (prop === 'chunk' && step[prop]) {
				return chunkp
			}
			if ( prop in step ) {
				return Reflect.get(step, prop, receiver)
			}
			return Reflect.get(target, prop, receiver)
		}
	}
	return new Proxy(blankStep, handler)
}