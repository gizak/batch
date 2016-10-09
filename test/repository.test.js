/*global describe:true, it:true, console:true, expect:true*/
/*eslint no-undef: "warn"*/
/*eslint-dsiable no-console */

const repo = require('../build/repository')
const shortid = require('shortid')

describe('Repo', ()=>{
	let db = null
	it('inits in-mem storage',()=>{
		db = new repo.Repo()
		expect(db.jScripts).toBeDefined()
	})

	it('inits in-disk storage', ()=>{
		db.initScriptsRepo('batchdb/scripts')
		expect(db.scriptDocs).toBeDefined()
	})
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
