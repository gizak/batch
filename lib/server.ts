/*	
    public static initServer(): Koa {
		const debug = Debug('app')
		const app = new Koa()
		const router = new Router()
		const jop = BatchRuntime.getJobOperator()

		router.get('/jobs', function *(next){
			const jbs = yield jop.lsJobs()
			this.body = JSON.stringify(jbs)
			yield next
		})

		app.use(router.routes())
		app.use(router.allowedMethods())
		return app
	}
*/