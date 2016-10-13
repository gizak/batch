declare var jest, describe, it, expect

import { Repo } from '../lib/repository'
import { JobExec } from '../lib/job-execution'
import { Status } from '../lib/status'

describe('Repo', () => {
	let db = null
	it('inits in-mem storage', () => {
		db = new Repo()
		expect(db.jScripts).toBeDefined()
	})

	it('inits in-disk storage', () => {
		db.initScriptsRepo('batchdb/scripts')
		expect(db.scriptDocs).toBeDefined()
	})

	it('converts JobExec to ExecDoc', () => {
		const je = new JobExec('jname')
		const doc = db._newExecDoc(je, 'inst-id')
		expect(doc.steps).toBeNull()
		expect(doc.instId).toBe('inst-id')
		expect(doc.status).toBe(Status['STARTING'])
	})

	it('adds ExecDoc data', () => {
		db.initExecsRepo('batchdb/execs')
		const doc = new JobExec('job')
		const resp = db.addExec(doc)
		resp
			.then(r => { expect(r).toBeDefined() })
			.catch(err => { console.log(err) })
	})

	it('adds ExecDoc data', () => { })
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
