class TransferBalance {
  profileRepository;

  constructor(profileRepository) {
    this.profileRepository = profileRepository;
  }

  async execute(
    amount, fromProfile, toProfileId, transaction,
  ) {
    const validateProfile = (profile) => profile.id && !!profile.balance;
    if (!amount || Number.isNaN(Number(amount))) throw new Error('Invalid value to transfer.');
    if (!fromProfile) throw new Error('The profile origin is needed to transfer.');
    if (!validateProfile(fromProfile)) throw new Error('The profile origin is invalid check the balance and the id.');
    if (!toProfileId) throw new Error('The profile destination is needed to transfer.');
    const toProfile = (await this.profileRepository.getProfiles({
      id: toProfileId,
    }, transaction))[0];
    if (!toProfile) throw new Error('Couldnot find the destination profile.');
    if (fromProfile.id === toProfile.id) throw new Error('Cant trasnfer ballance to the same profile.');
    if (amount > fromProfile.balance) throw Error('The client has less balance than the amount to transfer');
    await this.profileRepository.updateProfileBalance(
      fromProfile, Number(fromProfile.balance) - Number(amount), transaction,
    );
    await this.profileRepository.updateProfileBalance(
      toProfile, Number(toProfile.balance || 0) + Number(amount), transaction,
    );
    return 'success';
  }
}

module.exports = { TransferBalance };
