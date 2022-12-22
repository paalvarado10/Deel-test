class GetUnpaidJobs {
  jobRepository;

  getContracts;

  constructor(jobRepository, getContracts) {
    this.jobRepository = jobRepository;
    this.getContracts = getContracts;
  }

  async execute(profile) {
    try {
      const userContracts = await this.getContracts.execute(profile, 'in_progress');
      return this.jobRepository.getUnpayedJobs(userContracts.map((contract) => contract.id));
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  }
}

module.exports = { GetUnpaidJobs };
