import {Batchlet} from './batchlet'
import {Chunk} from './chunk'
import {Step} from './step'

export interface Job {
	id: string
	restartable?: boolean
	listener?: JobListener
	steps: Step[]
}

export interface JobListener {
	beforeJob(): void
	afterJob(): void
}

export class Job {
}