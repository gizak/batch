const batch = require('../build/lib/batch')
const jobop = batch.BatchRuntime.getJobOperator()

jobop.initRepository({
	jobs: { datastore: 'nedb' }
}).then((jop) => {
	
	jobop.loadJob('/Users/gizak/Workspace/batch/test/job1.js').then(data => {
			jobop.lsJobs().then(data => { console.log(data) })
			jobop.getJob('testjob').then(data => { console.log(data) })
		})
}).catch(err => { throw err })
