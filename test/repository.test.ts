declare var jest, describe, it, expect

import { Repo } from '../build/repository'
import { JobExec } from '../build/job-execution'
import { Status } from '../build/status'

describe('Repo', () => {
	let db = null

	it('inits in-mem storage', () => {
		db = new Repo()
		expect(db.jScripts).toBeDefined()
	})

	it('inits in-disk storage', () => {
		db.initScriptsRepo('batchdb/scripts')
		db.initExecsRepo('batchdb/execs')
		expect(db.scriptDocs).toBeDefined()
		expect(db.execDocs).toBeDefined()
	})

	it('converts JobExec to ExecDoc', () => {
		const je = new JobExec('jname')
		const doc = db._newExecDoc(je, 'inst-id')
		expect(doc.steps).toBeNull()
		expect(doc.instId).toBe('inst-id')
		expect(doc.status).toBe(Status['STARTING'])
	})

	it('adds ExecDoc data', async () => {
		const doc = new JobExec('job')
		const resp = await db.addExec(doc)
		expect(resp).toBeDefined()
	})

	it('adds StepExecDoc data', () => { })
	/*
	it('connects remote db server', ()=>{
		// use pouchdb-server -m -n before tests
		db.initScriptsRepo('http://127.0.0.1:5984/scripts')
		expect(db.scriptDocs).toBeDefined()
		// mock
		const js = {_id: shortid.generate(), _ctime: new Date(), fpath: require.resolve('.'), fstr: 'content'}
		db.addScript(js).catch(e=>{
			expect(e).not.toBeDefined()
		})
	})
	*/
})
