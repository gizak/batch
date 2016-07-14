interface JobInstance {
	/**
	 * getInstanceId
	 * @return job instance id
	 */
	getInstanceId(): number
	/**
	 * Get job name
	 * @return value of 'id' attribute from <job>
	 */
	getJobName(): string
}