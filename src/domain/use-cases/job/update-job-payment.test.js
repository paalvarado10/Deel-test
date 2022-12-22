const { JobRepository, JobMockData } = require("../__mocks__/job/job-repository.mock");
const { UpdateJobPayment } = require("./update-job-payment");

const jobsMockRepo = new JobRepository();
const updateJobPayment = new UpdateJobPayment(jobsMockRepo);

describe('test update job payment use case', () => {
  it('should throw error if job has been paid', async () => {
    try {
      await updateJobPayment.execute(1);
    } catch (error) {
      expect(error.message).toBe('Cant pay a paid job')
    }
  })
  it('should throw error if job doesnot exists', async () => {
    try {
      await updateJobPayment.execute(100);
    } catch (error) {
      expect(error.message).toBe('Unable to update payment for the job')
    }
  })
  it('should update job payment', async () => {
    const jobToUpdate = JobMockData[1];
    await updateJobPayment.execute(jobToUpdate.id);
    expect(JobMockData[1].paid).toBe(true);
    expect(JobMockData[1].paymentDate).not.toBeNull();
  })
});