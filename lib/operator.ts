
interface JobInst {}
interface JobExec {}
interface StepExec {}

export class Operator {
	private jobNames: string[]

	jobInstCnt(jname: string): number {
		return 0
	}

	jobInsts(jname: string, start?: number, count?: number): JobInst[] {
		return []
	}

	runningExecs(jname: string): string[] {
		return []
	}

	start(jfile: string): string {
		return ''
	}

	restart(execId: string): string {
		return ''
	}

	stop(execId: string): void {

	}

	abandon(execId: string) {}

	jobInst(execId: string): JobInst {
		return null
	}

	jobExecs(inst: JobInst): JobExec[] {
		return []
	}

	jobExec(execId: string): JobExec {
		return null
	}

	stepExecs(execId: string): StepExec[] {
		return []
	}
} 