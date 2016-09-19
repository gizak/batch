/*global describe:true, it:true, console:true, expect:true*/
/*eslint no-undef: "warn"*/

const rt = require('../build/runtime')

describe('runtime', ()=>{
	it('can get JobOperator',()=>{
		rt.Runtime.operator
	})
})
