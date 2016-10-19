declare var jest, describe, it, expect

import { Repo } from '../build/repository'
import { JobExec } from '../build/job-execution'
import { Status } from '../build/status'
import { Runtime } from '../build/runtime'

describe('Repo', () => {
	Runtime.initStore({ scripts: { dsn: 'batchdb/scripts' }, execs: { dsn: 'batchdb/execs' }})
	Runtime.initLogger()
	const op = Runtime.operator
	const db = Runtime.db

	it('inits in-mem storage', () => {
		const db2 = new Repo()
		expect(db2.jScripts).toBeDefined()
	})

	it('inits in-disk storage', () => {
		expect(db.scriptDocs).toBeDefined()
		expect(db.execDocs).toBeDefined()
	})

	it('can add JobScript', async () => {
		const {js} = await op._loadJobScriptFromFile('test/job1.js')
		expect(js).toBeDefined()

		const ji = op._newJobInst(js)
		expect(ji).toBeDefined()
		expect(Object.keys(Runtime.db.jInsts).length).toBe(1)

		const je = op._newJobExec(ji)
		expect(je).toBeDefined()
		expect(Object.keys(Runtime.db.jExecs).length).toBe(1)

		const jc = op._newJobCtx(ji, je)
		expect(jc).toBeDefined()
		expect(Object.keys(Runtime.db.jCtxs).length).toBe(1)
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
