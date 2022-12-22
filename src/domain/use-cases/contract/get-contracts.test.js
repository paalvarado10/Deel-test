const { ContractMockRepository, ContractMockData } = require("../__mocks__/contract/contract-repository.mock");
const { GetContracts } = require("./get-contracts");

const contractRepository = new ContractMockRepository(ContractMockData);
const getContracts = new GetContracts(contractRepository);

const validClient = {
  id: 4,
  type: 'client'
};

const validContractorContractResponse = [
  {
    id: 1,
    terms: 'some terms',
    status: 'terminated',
    ContractorId: 1,
    ClientId: 4,
  },
  {
    id: 4,
    terms: 'some terms',
    status: 'in_progress',
    ContractorId: 1,
    ClientId: 6,
  }
]
const validClientContractResponse = [
  {
    id: 1,
    terms: 'some terms',
    status: 'terminated',
    ContractorId: 1,
    ClientId: 4,
  },
  {
    id: 6,
    terms: 'some terms',
    status: 'new',
    ContractorId: 3,
    ClientId: 4,
  }
]
const validContractor = {
  id: 1,
  type: 'contractor'
};
const clientNoContract = {
  id: 10,
  type: 'client'
};

const contractorNoContract = {
  id: 11,
  type: 'contractor'
};

describe('test get contracts use case', () => {
  it('should get the client contracts', async () => {
    const contracts = await getContracts.execute(validClient);
    expect(contracts).toEqual(validClientContractResponse);
  })
  it('should get the contractor contracts', async () => {
    const contracts = await getContracts.execute(validContractor);
    expect(contracts).toEqual(validContractorContractResponse);
  })
  it('should not get contracts because profile id is not a client or a contractor id', async () => {
    const contracts = await getContracts.execute(clientNoContract);
    expect(contracts).toEqual([]);
  })
  it('should thow error if no profile is passed', async () => {
    try {
      await getContracts.execute();
    } catch (error) {
      expect(error.message).toEqual('Profile data is required')
    }
  })
  it('should thow error if an invalid profile type is passed', async () => {
    try {
      await getContracts.execute({ id: 1, type: 'any type' });
    } catch (error) {
      expect(error.message).toEqual('Invalid profile type')
    }
  })
  it('should thow error if no profile id is passed', async () => {
    try {
      await getContracts.execute({ type: 'client' });
    } catch (error) {
      expect(error.message).toEqual('Can\'t find profile contracts')
    }
  })
});

module.exports = { validClient, validContractorContractResponse, validClientContractResponse, validContractor, clientNoContract, contractorNoContract }