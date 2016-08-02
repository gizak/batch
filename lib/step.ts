import {Chunk} from './chunk'
import {Batchlet} from './batchlet'

interface Step {
	id: string
	listener: StepListener
	chunk?: Chunk
	batchlet?: Batchlet
}

interface StepListener {
	beforeStep(): void
	afterStep(): void
}