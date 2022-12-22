const { GetContracts } = require("../contract/get-contracts");
const { GetUnpaidJobs } = require("../job/get-unpaid-jobs");
const { ContractMockRepository, ContractMockData } = require("../__mocks__/contract/contract-repository.mock");
const { JobRepository } = require("../__mocks__/job/job-repository.mock");
const { ProfileMockRepository, profileMockData } = require("../__mocks__/profile/profile-repository.mock");
const { DepositClientBalance } = require("./deposit-client-balance");

const profileRepository = new ProfileMockRepository(profileMockData);
const depositClientBalance = new DepositClientBalance(profileRepository);

const contractRespository = new ContractMockRepository(ContractMockData);
const getContracts = new GetContracts(contractRespository);
const jobsMockRepo = new JobRepository();
const getUnpaidJobs = new GetUnpaidJobs(jobsMockRepo, getContracts);

const validClientProfile = profileMockData[5];
const validClientProfileNoPendingPay = profileMockData[3];
const validContractorProfile = profileMockData[0];
describe('test deposit client balance use case', () => {
  it('should fail trying to deposit from a contractor', async () => {
    try {
      await depositClientBalance.execute(getUnpaidJobs, validContractorProfile, 1000);
    } catch (error) {
      expect(error.message).toBe('Should be a client to deposit money')
    }
  });
  it('should fail trying to deposit more than the 25% his total of jobs to pay', async () => {
    try {
      await depositClientBalance.execute(getUnpaidJobs, validClientProfile, 1000);
    } catch (error) {
      expect(error.message).toBe('A client can\'t deposit more than 25% his total of jobs to pay')
    }
  });
  it('should fail trying to deposit more than the client balance', async () => {
    try {
      await depositClientBalance.execute(getUnpaidJobs, validClientProfileNoPendingPay, validClientProfileNoPendingPay.balance + 1);
    } catch (error) {
      expect(error.message).toBe('The client has less balance than the amount to transfer')
    }
  });
  it('it should deposit the amount in the client balance', async () => {
    const startBalanceContractor = validClientProfileNoPendingPay.balance;
    const balanceToDeposit = 10;
    await depositClientBalance.execute(getUnpaidJobs, validClientProfileNoPendingPay, balanceToDeposit);
    expect(startBalanceContractor).not.toBe(validContractorProfile.balance)
    expect(startBalanceContractor + balanceToDeposit).toBe(validClientProfileNoPendingPay.balance)
  });
});