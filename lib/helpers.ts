export function setPropsEnum(o: any, keys: string[]) {
	for (const k of keys) {
		Object.defineProperty(o, k, {enumerable: true})
	}
}