import {Chunk} from './chunk'
import {Batchlet} from './batchlet'

export interface Step {
	id: string
	listener?: StepListener
	chunk?: Chunk
	batchlet?: Batchlet
}

export interface StepListener {
	beforeStep(): void
	afterStep(): void
}