import {Status} from '../runtime'
import {Chunk} from './chunk'
import {Batchlet} from './batchlet'
import {enumerable} from 'core-decorators'
import {setPropsEnum} from '../helpers'

export class Step {
	public chunk: Chunk
	public batchlet: Batchlet

	@enumerable
	public before() {}

	@enumerable
	public after() {}

	constructor() {
		this.chunk = null
		this.batchlet = null
	}
}

export class StepContext {
	private _name: string
	private _transData: any

	get stepName(): string { return this._name }
	get transientUserData(): any { return this._transData }
	set transientUserData(data: any) { this._transData = data }
	execId(): string { return '' }
	get persistentUserData(): any { return '' }
	set persistentUserData(data: any) {}
	status(): Status { return 0 }
	get exitStatus(): string { return ''}
	set exitStatus(s: string) {}
}
// setPropsEnum(Step.propertype, ['before',])