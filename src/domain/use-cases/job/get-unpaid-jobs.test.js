
const { GetContracts } = require("../contract/get-contracts");
const { contractorNoContract, clientNoContract } = require("../contract/get-contracts.test");
const { ContractMockRepository, ContractMockData } = require("../__mocks__/contract/contract-repository.mock");
const { JobRepository, JobMockData } = require("../__mocks__/job/job-repository.mock");
const { GetUnpaidJobs } = require("./get-unpaid-jobs")

const contractRespository = new ContractMockRepository(ContractMockData);
const getContracts = new GetContracts(contractRespository);
const jobsMockRepo = new JobRepository();
const getUnpaidJobs = new GetUnpaidJobs(jobsMockRepo, getContracts);

const clientProfileWithUnpaidJobs = {
  id: 6,
  type: 'client'
};

const contractorProfileWithUnpaidJobs = {
  id: 1,
  type: 'contractor'
};

const clientUnpaidJobs = [JobMockData[2], JobMockData[3]];
const contractorUnpaidJobs = [JobMockData[3]];

describe('test get un paid jobs use case', () => {
  it('should get unpaid jobs for a client', async () => {
    const unpaidClientJobs = await getUnpaidJobs.execute(clientProfileWithUnpaidJobs);
    expect(unpaidClientJobs).toEqual(clientUnpaidJobs);
  })
  it('should get unpaid jobs for a contractor', async () => {
    const unpaidContractorJobs = await getUnpaidJobs.execute(contractorProfileWithUnpaidJobs);
    expect(unpaidContractorJobs).toEqual(contractorUnpaidJobs);
  })
  it('should not get unpaid jobs for a contractor without contracts', async () => {
    const unpaidContractorJobs = await getUnpaidJobs.execute(contractorNoContract);
    expect(unpaidContractorJobs).toEqual([]);
  })
  it('should not get unpaid jobs for a client without contracts', async () => {
    const unpaidClientJobs = await getUnpaidJobs.execute(clientNoContract);
    expect(unpaidClientJobs).toEqual([]);
  })

  it('should thow error if invalid profile', async () => {
    try {
      await getUnpaidJobs.execute({ type: 'client' });
    } catch (error) {
      expect(error.message).toEqual('Error: Can\'t find profile contracts')
    }
  })
})

