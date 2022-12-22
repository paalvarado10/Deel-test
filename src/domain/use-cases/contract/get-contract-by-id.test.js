const { ContractMockRepository, ContractMockData } = require("../__mocks__/contract/contract-repository.mock");
const { GetContractById } = require("./get-contract-by-id");
const { validClient, validContractorContractResponse, validContractor } = require("./get-contracts.test");

const contractRepository = new ContractMockRepository(ContractMockData);
const getContractById = new GetContractById(contractRepository);

describe('test get contracts use case', () => {
  it('should thow error if no profile is passed', async () => {
    try {
      await getContractById.execute(null, 1);
    } catch (error) {
      expect(error.message).toEqual('Profile data is required')
    }
  })
  it('should thow error if no contractId is passed', async () => {
    try {
      await getContractById.execute({ id: 1, type: 'client'});
    } catch (error) {
      expect(error.message).toEqual('Contract id is required')
    }
  })
  it('should thow error if an invalid profile type is passed', async () => {
    try {
      await getContractById.execute({ id: 1, type: 'any type' }, 1);
    } catch (error) {
      expect(error.message).toEqual('Invalid profile type')
    }
  })
  it('should thow error if no profile id is passed', async () => {
    try {
      await getContractById.execute({ type: 'client' }, 1);
    } catch (error) {
      expect(error.message).toEqual('Can\'t find profile contracts')
    }
  })
  it('it should get a contract for the given client profile', async() => {
    const contract = await getContractById.execute(validClient, 1);
    expect(contract).toEqual(validContractorContractResponse[0])
  })
  it('it should get a contract for the given contractor profile', async() => {
    const contract = await getContractById.execute(validContractor, 1);
    expect(contract).toEqual(validContractorContractResponse[0])
  })
  it('it should not get the contract profile is not a client or contractor in the contract', async() => {
    try {
      await getContractById.execute(validClient, 2);
    } catch (error) {
      expect(error.message).toEqual('Unable to find the given Contract.')
    }
  })
})