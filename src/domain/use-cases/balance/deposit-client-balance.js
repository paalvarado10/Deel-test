/**
 * * Deposits money into the the the balance of a client
 * */

class DepositClientBalance {
  profileRepository;

  constructor(profileRepository) {
    this.profileRepository = profileRepository;
  }

  async execute(
    getUnpaidJobs, profile, amount, transaction,
  ) {
    if (profile.type !== 'client') { throw Error('Should be a client to deposit money'); }
    const unpaidJobs = await getUnpaidJobs.execute(profile);
    const totalToPay = unpaidJobs
      .map((job) => Number(job.price))
      .reduce((current, accumulated) => current + accumulated, 0);
    const maxValueToTransfer = totalToPay * 0.25;
    if (maxValueToTransfer && maxValueToTransfer < amount) { throw new Error("A client can't deposit more than 25% his total of jobs to pay"); }
    return this.profileRepository.updateProfileBalance(
      profile,
      Number(profile.balance || 0) + Number(amount),
      transaction,
    );
  }
}

module.exports = { DepositClientBalance };
