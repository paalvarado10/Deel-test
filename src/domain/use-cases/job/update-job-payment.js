class UpdateJobPayment {
  jobRepository;

  constructor(jobRepository) {
    this.jobRepository = jobRepository;
  }

  async execute(jobId, transaction) {
    const jobToUpdate = (await this.jobRepository.getJobs({ id: jobId }, transaction))[0];
    if (jobToUpdate && !jobToUpdate.paid) {
      return this.jobRepository.updatePayment(jobToUpdate, transaction);
    }
    if (!jobToUpdate) throw new Error('Unable to update payment for the job');
    throw new Error('Cant pay a paid job');
  }
}

module.exports = { UpdateJobPayment };
