/**
   * Pay for a job
   */

class PayJob {
  jobRepository;

  constructor(jobRepository) {
    this.jobRepository = jobRepository;
  }

  async execute(
    getContractById,
    transferBalance,
    updateJobPayment,
    jobId,
    clientProfile,
    transaction,
  ) {
    try {
      if (clientProfile.type !== 'client') throw new Error('To pay for a Job the user must be a client.');
      const job = (await this.jobRepository.getJobs({ id: jobId }))[0];
      if (!job) throw new Error('The Job wasnt found');
      const contract = await getContractById.execute(clientProfile, job.ContractId);
      await transferBalance.execute(
        job.price, clientProfile, contract.ContractorId, transaction,
      );
      await updateJobPayment.execute(jobId, transaction);
      return `Job ${jobId} was succesfully payed`;
    } catch (err) {
      console.error('error paying job', err);
      throw new Error(err.message);
    }
  }
}

module.exports = { PayJob };
