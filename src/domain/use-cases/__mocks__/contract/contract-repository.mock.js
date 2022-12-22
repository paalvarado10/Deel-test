/* eslint-disable no-unused-vars */
class ContractMockRepository {
  contractDataSource;

  constructor(contractDataSource) {
    this.contractDataSource = contractDataSource || [];
  }

  async getContractById(id, transaction) {
    return this.contractDataSource.filter((contract) => contract.id === id)[0];
  }

  async getContractorContracts(
    contractorId, status, transaction,
  ) {
    return this.contractDataSource.filter((contract) => {
      const sameStatus = !status || (status === contract.status);
      const sameContractor = contractorId === contract.ContractorId;
      return sameStatus && sameContractor;
    });
  }

  async getClientContracts(
    clientId, status, transaction,
  ) {
    return this.contractDataSource.filter((contract) => {
      const sameStatus = !status || (status === contract.status);
      const sameClient = clientId === contract.ClientId;
      return sameStatus && sameClient;
    });
  }
}

const ContractMockData = [
  {
    id: 1,
    terms: 'some terms',
    status: 'terminated',
    ContractorId: 1,
    ClientId: 4,
  },
  {
    id: 2,
    terms: 'some terms',
    status: 'new',
    ContractorId: 2,
    ClientId: 5,
  },
  {
    id: 3,
    terms: 'some terms',
    status: 'in_progress',
    ContractorId: 3,
    ClientId: 6,
  },
  {
    id: 4,
    terms: 'some terms',
    status: 'in_progress',
    ContractorId: 1,
    ClientId: 6,
  },
  {
    id: 5,
    terms: 'some terms',
    status: 'in_progress',
    ContractorId: 2,
    ClientId: 5,
  },
  {
    id: 6,
    terms: 'some terms',
    status: 'new',
    ContractorId: 3,
    ClientId: 4,
  },
];

module.exports = { ContractMockRepository, ContractMockData };
