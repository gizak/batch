/*global describe:true, it:true, console:true, expect:true*/
/*eslint no-undef: "warn"*/
/*eslint-dsiable no-console */

const repo = require('../build/repository')

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
})
