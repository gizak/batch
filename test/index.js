const batch = require('../')

batch.Runtime.init({log: {level: 'debug'}})
const op = batch.Runtime.operator
op.start('test/job1.js').then( id => {
	console.log(id)
}).catch(e => console.log(e))
