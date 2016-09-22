export function newObjProxy<T>(obj: any, shadow: T): T {
	obj = obj || {}
	const handler = {
		get(target, prop, receiver) {
			if (prop in obj && obj[prop] !== undefined) {
				return Reflect.get(obj, prop)
			}
			return Reflect.get(target, prop, receiver)
		}
	}
	return new Proxy<T>(shadow, handler)
}