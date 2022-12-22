class GetContracts {
  contractRepository;

  constructor(contractRepository) {
    this.contractRepository = contractRepository;
  }

  async execute(profile, status) {
    if (!profile) throw new Error('Profile data is required');
    if (!profile.type || !['client', 'contractor'].includes(profile.type)) throw new Error('Invalid profile type');
    if (!profile.id) throw new Error('Can\'t find profile contracts');
    if (profile.type === 'client') return this.contractRepository.getClientContracts(profile.id, status);
    return this.contractRepository.getContractorContracts(profile.id, status);
  }
}

module.exports = { GetContracts };
