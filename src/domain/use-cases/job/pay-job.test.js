const {
  ContractMockRepository,
  ContractMockData,
} = require('../__mocks__/contract/contract-repository.mock');
const { GetContractById } = require('../contract/get-contract-by-id');
const { JobRepository } = require('../__mocks__/job/job-repository.mock');
const { PayJob } = require('./pay-job');
const { UpdateJobPayment } = require('./update-job-payment');
const {
  ProfileMockRepository,
  profileMockData,
} = require('../__mocks__/profile/profile-repository.mock');
const { TransferBalance } = require('../balance/transfer-balance');

const profileRepository = new ProfileMockRepository(profileMockData);
const jobRepository = new JobRepository();
const contractRepository = new ContractMockRepository(ContractMockData);

const transferBalance = new TransferBalance(profileRepository);
const getContractById = new GetContractById(contractRepository);
const updateJobPayment = new UpdateJobPayment(jobRepository);

const payJob = new PayJob(jobRepository);

const clientValidProfile = profileMockData[5];
const contractorValidProfile = profileMockData[2];

describe('test pay job use case ', () => {
  it('should fail if the profile passed is a contractor', async () => {
    try {
      await payJob.execute(
        getContractById,
        transferBalance,
        updateJobPayment,
        100,
        contractorValidProfile
      );
    } catch (error) {
      expect(error.message).toBe('To pay for a Job the user must be a client.');
    }
  });
  it('should fail if the jobid passed doesnot exists', async () => {
    try {
      await payJob.execute(
        getContractById,
        transferBalance,
        updateJobPayment,
        100,
        clientValidProfile
      );
    } catch (error) {
      expect(error.message).toBe('The Job wasnt found');
    }
  });
  it('should pay the given job', async () => {
    const jobToPay = 4;
    const response = await payJob.execute(
      getContractById,
      transferBalance,
      updateJobPayment,
      jobToPay,
      clientValidProfile
    );
    expect(response).toBe(`Job ${jobToPay} was succesfully payed`);
  });
});
