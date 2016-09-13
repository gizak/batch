const loader = require('../build/loader')

describe('loader', ()=>{
    it('can pass syntax check', ()=>{
        loader.newVMScript('./test/job1.js')
    })
})