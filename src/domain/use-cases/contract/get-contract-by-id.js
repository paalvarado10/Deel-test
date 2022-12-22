class GetContractById {
  contractRepository;

  constructor(contractRepository) {
    this.contractRepository = contractRepository;
  }

  async execute(profile, contractId) {
    if (!contractId) throw new Error('Contract id is required');
    if (!profile) throw new Error('Profile data is required');
    if (!profile.type || !['client', 'contractor'].includes(profile.type)) throw new Error('Invalid profile type');
    if (!profile.id) throw new Error('Can\'t find profile contracts');
    const contract = await this.contractRepository.getContractById(contractId);
    const contractBelongsToUser = !!contract
      && (contract.ContractorId === profile.id || contract.ClientId === profile.id);
    if (contractBelongsToUser) return contract;
    throw new Error('Unable to find the given Contract.');
  }
}

module.exports = { GetContractById };
