import {BatchRuntime} from '../lib/batch'

const jobop = BatchRuntime.getJobOperator()
const baseUrl = 'http://jsonplaceholder.typicode.com'

const chunker = {
	open: (chk: Object) => {
		console.log('open')
	},
	readItem: (): Object => {
		console.log('readItem')
		return {}
	},
	close: () => {
		console.log('close')
	},
	checkpointinfo: (): Object => {
		console.log('checkpoint')
		return {}
	},
	processItem: (item: Object): Object => {
		console.log('processItem')
		return {}
	}
}

const batchleter = {
	process: (): string => {
		console.log('process')
		return ''
	},
	stop: () => {
		console.log('stop')
	}
}

jobop.loadJob({
	id: 'testjob',
	restartble: true,
	steps: [
		{
			id: 'step1',
			chunk: {
				reader: chunker,
				processor: chunker,
				writer: chunker,
				itemCount: 1
			}
		},
		{
			id: 'step2',
			batchlet: batchleter
		}
	]
})