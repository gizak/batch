const batch = require('../')
//const step = require('../build/runtime/step')
batch.Runtime.init({})
const jo = batch.Runtime.operator
jo.start('test/job1.js')