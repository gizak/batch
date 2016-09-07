batch = require('../')

describe('JobOperator',()=>{
    let jo;
    let j;
    it('needs runtime init', () => {
	expect(batch.Runtime).toBeDefined()
	batch.Runtime.init({log:{
	    name: "batch",
	    streams:[{path: '/dev/null'}]
	}})
	expect(batch.Runtime.db).toBeDefined()
	expect(batch.Runtime.repo).toBeDefined()
    });

    it('obtained from runtime',()=>{
	jo = batch.Runtime.jobOperator()
	expect(jo).toBeDefined()
    })

    it('loads job file', ()=>{
	const jf = 'test/job1.js'
	j = jo._load(jf)
	expect(j).toBeDefined()
	expect(j.path).toBeDefined()
    })

    it('setups repo before run', ()=>{
	const je = jo._before(j)
	expect(je).toBeDefined()
	expect(jo.repo.jobCtx.length).toEqual(1)
	expect(jo.repo.jobInsts.length).toEqual(1)
	expect(jo.repo.jobExecs.length).toEqual(1)
    })
})
