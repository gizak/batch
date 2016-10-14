const batch = require('../')
//const step = require('../build/runtime/step')
batch.Runtime.init({ scripts: { dsn: 'batchdb/scripts' }, execs: { dsn: 'batchdb/execs' }} )
//const jo = batch.Runtime.operator
batch.Runtime._dumpDB()
