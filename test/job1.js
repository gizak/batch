const baseUrl = 'http://jsonplaceholder.typicode.com'

const chunker = {
	open: (chk) => {
		console.log('open')
	},
	readItem: () => {
		console.log('readItem')
		return {}
	},
	close: () => {
		console.log('close')
	},
	checkpointinfo: () => {
		console.log('checkpoint')
		return {}
	},
	processItem: (item) => {
		console.log('processItem')
		return {}
	}
}

const batchleter = {
	process: () => {
		console.log('process')
		return ''
	},
	stop: () => {
		console.log('stop')
	}
}

module.exports = {
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
}