import {Chunk} from './chunk'
import {Batchlet} from './batchlet'

export abstract class Step {
	id: string
	beforeStep(): void {}
	afterStep(): void {}
	context: StepContext
	chunk: Chunk
	batchlet: Batchlet
}

export interface StepListener {
	beforeStep(): void
	afterStep(): void
}

export class StepContext {
	private name: string
	private data: any

	getStepName(): string {
		return this.name
	}

	getTransientUserData(): any {
		return this.data
	}

	setTransientUserData(data: any) {
		this.data = data
	}

	getStepExecutionId() {}

	getPersistentUserData() {}

	setPersistentUserData() {}

	getBatchStatus() {}

	getExitStatus() {}

	setExitStatus() {}

	getException() {}

	getMetrics() {}
}