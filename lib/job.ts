import { Step } from './step'
import { StepCtx } from './step-context'
import { JobCtx } from './job-context'
import { JobRuntime } from './job-runtime'
import { newStepProxy } from './step'
import * as Joi from 'joi'
import * as shortid from 'shortid'

export class Job {
	public id: string
	public steps: Step[]
	public restartable: boolean

	public before() {}
	public after() {}

	// proxy stub
	public RUNTIME: JobRuntime
	public readonly _id: string

	constructor() {
		this.id = ''
		this.steps = []
		this.restartable = false
	}
}

export function newJobProxy(obj: any, rt: any): Job {
	const schema = Joi.object().keys({
		id: Joi.string().min(1).required(),
		restartable: Joi.boolean(),
		steps: Joi.array().items(
			Joi.object()
			.keys({id: Joi.string().min(1).required()})
			.xor('chunk', 'batchlet'))
		.required()
	})
	const res = Joi.validate(obj, schema, {allowUnknown: true})
	if (res.error) { throw res.error }

	const steps: Step[] = []
	if (obj.steps) {
		for ( const s of obj.steps ) {
			steps.push(newStepProxy(s))
		}
	}
	const instId = shortid.generate()
	const handler = {
		get(target, prop, receiver) {
			if (prop === 'RUNTIME') { return rt }
			if (prop === '_id') { return instId }
			if (prop === 'steps') { return steps }
			if (prop in obj) { return Reflect.get(obj, prop, receiver)	}
			return Reflect.get(target, prop, receiver)
		}
	}

	return new Proxy<Job>(new Job(), handler)
}