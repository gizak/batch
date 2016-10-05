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
	jo = batch.Runtime.operator
	expect(batch.Runtime.jobOperator()).not.toBeDefined()	
	expect(jo).toBeDefined()
	expect(batch.Runtime.operator).toBe(jo)
    })

    it('loads job file', ()=>{
	const jf = 'test/job1.js'
	j = jo._load(jf)
	expect(j).toBeDefined()
	expect(j.path).toBeDefined()
	expect(jo.repo.jobInsts.length).toEqual(1)
    })

    it('setups repo before run', ()=>{
	const je = jo._before(j)
	expect(je).toBeDefined()
	expect(jo.repo.jobCtxs.length).toEqual(1)
	expect(jo.repo.jobExecs.length).toEqual(1)
    })

    it('starts job instance', ()=>{
	jo._startJobInst(j).then((d)=>{
	    expect(d).toBeUndefined()
	})
    })
})
