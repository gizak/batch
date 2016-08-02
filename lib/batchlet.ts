export interface Batchlet {
	process(): string
	stop(): void
}