const batch = require('../')
const bformat = require('bunyan-format')
const formatOut = bformat({ outputMode: 'short', level: 'debug' })

batch.Runtime.init({log: {stream: formatOut, level: 'debug'}})
const op = batch.Runtime.operator
op.start('test/job1.js').then( id => {
	console.log(id)
}).catch(e => console.log(e))
