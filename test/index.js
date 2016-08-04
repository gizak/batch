const batch = require('../build/lib/batch')
const jobop = batch.BatchRuntime.getJobOperator()

jobop.initRepository()
jobop.loadJob('/Users/gizak/Workspace/batch/test/job1.js')
	.then(data => { return jobop.loadJob('/Users/gizak/Workspace/batch/test/job1.js') }).then(data => {
		jobop.lsJobs().then(data => { console.log(data) })
		jobop.getJob('testjob').then(data => { console.log(data) })
	}).catch(err => { throw err })
