const batch = require('../')

batch.Runtime.init({})
const jo = batch.Runtime.jobOperator()
jo.start('/Users/gizak/workspace/batch/test/job1.js')