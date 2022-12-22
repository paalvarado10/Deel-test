class ContractRepository {
  contractDataSource;

  constructor(contractDataSource) {
    this.contractDataSource = contractDataSource;
  }

  async getContractById(id, transaction) {
    const contracts = await this.getContracts({ id }, transaction);
    return contracts[0];
  }

  async getContractorContracts(
    contractorId, status, transaction,
  ) {
    const where = {
      ContractorId: contractorId,
    };
    if (status) where.status = status;
    return this.getContracts(where, transaction);
  }

  async getClientContracts(
    clientId, status, transaction,
  ) {
    const where = {
      ClientId: clientId,
    };
    if (status) where.status = status;
    return this.getContracts(where, transaction);
  }

  async getContracts(where, transaction) {
    return this.contractDataSource.findAll({ where }, transaction);
  }
}

module.exports = { ContractRepository };
