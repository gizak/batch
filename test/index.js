const batch = require('../build/lib/batch')
const jobop = batch.BatchRuntime.getJobOperator()

jobop.initRepository()
jobop.loadJob('/Users/gizak/Workspace/batch/test/job1.js').catch(err=>{throw err})
jobop.lsJobs().then(data=>{console.log(data)})
jobop.getJob('testjob').then(data=>{console.log(data)})