import {Batchlet} from './batchlet'
import {Chunk} from './chunk'

interface Job {
	id: string
	restartable?: boolean
	listener?: JobListener
	steps: Array<Batchlet|Chunk>
}

interface JobListener {
	beforeJob(): void
	afterJob(): void
}