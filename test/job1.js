const baseUrl = 'http://jsonplaceholder.typicode.com'

const data = [0, 1, 2, 3, 4, 5, 6]
let eData = []

const reader = {
	open: (chk) => {
		eData = data[Symbol.iterator]()
		console.log('[reader] open')
	},
	readItem: () => {
		const v = eData.next().value
		console.log('[reader] readItem: ' + v)
		return v
	},
	close: () => {
		console.log('[reader] close')
	},
	checkpointinfo: () => {
		console.log('[reader] checkpoint')
		return {}
	}
}

const processor = {
	processItem: (item) => {
		console.log('[processor] processItem')
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
				reader: reader,
				processor: processor,
				writer: {},
				itemCount: 1
			}
		},
		{
			id: 'step2',
			batchlet: batchleter
		}
	]
}