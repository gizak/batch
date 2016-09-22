const rq = require('request-promise-native')
const baseUrl = 'http://jsonplaceholder.typicode.com'

let eData = []

const reader = {
	open: (chk) => {
		return rp({uri: baseUrl+'/albums', json: true}).then((j)=>{
			eData = j[Symbol.iterator]()
		})
	},
	readItem: () => {
		const v = eData.next().value
		//console.log('[reader]\t readItem: ' + v)
		return v
	},
	close: () => {
		//console.log('[reader]\t close')
	},
	checkpointinfo: () => {
		//console.log('[reader]\t checkpoint')
		return {}
	}
}

const processor = {
	processItem: (item) => {
		//console.log('[processor]\t processItem ' + item)
		return item
	}
}

const writer = {
	writeItems: (res) => {
		//console.log('[writer]\t writeItems(' + res.length + ') ' + res)
	}
}

const batchleter = {
	process: () => {
		//console.log('process')
		return ''
	},
	stop: () => {
		//console.log('stop')
	}
}

module.exports = {
	restartble: true,
	steps: [{
		id: 'step1',
		chunk: {
			reader: reader,
			processor: processor,
			writer: writer,
			itemCount: 1
		}
	}, {
		batchlet: batchleter
	}]
}
