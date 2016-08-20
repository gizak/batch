import {Status} from '../runtime'

export interface Step {}

export class StepContext {
	private _name: string
	private _transData: any

	get stepName(): string { return this._name}
	get transientUserData(): any { return this._transData}
	set transientUserData(data: any) { this._transData = data }
	execId(): string { return ''}
	get persistentUserData(): any { return ''}
	set persistentUserData(data: any) {}
	status(): Status { return 0}
	get exitStatus(): string { return ''}
	set exitStatus(s: string) {}
}