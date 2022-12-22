/* eslint-disable no-unused-vars */

const JobMockData = [
  {
    id: 1,
    description: 'A Job Description',
    price: 20,
    paid: true,
    paymentDate: new Date('2022/12/01'),
    ContractId: 1,
  },
  {
    id: 2,
    description: 'second Job Description',
    price: 25,
    paid: false,
    paymentDate: null,
    ContractId: 2,
  },
  {
    id: 3,
    description: 'third Job Description',
    price: 25,
    paid: false,
    paymentDate: null,
    ContractId: 3,
  },
  {
    id: 4,
    description: 'fourth Job Description',
    price: 25,
    paid: false,
    paymentDate: null,
    ContractId: 4,
  },
  {
    id: 5,
    description: '5 Job Description',
    price: 25,
    paid: false,
    paymentDate: null,
    ContractId: 5,
  },
  {
    id: 6,
    description: '6 Job Description',
    price: 25,
    paid: false,
    paymentDate: null,
    ContractId: 6,
  },
];

class JobRepositoryMock {
  data;

  constructor(dataSource) {
    this.data = dataSource || JobMockData;
  }

  async getUnpayedJobs(contractIds) {
    return this.data.filter((job) => contractIds.includes(job.ContractId));
  }

  async getJobs(where, transaction) {
    const { id } = where;
    return this.data.filter((job) => job.id === id);
  }

  async updatePayment(jobToUpdate, transaction) {
    for (let index = 0; index < this.data.length; index += 1) {
      const job = this.data[index];
      if (job.id === jobToUpdate.id) {
        job.paid = true;
        job.paymentDate = new Date();
        this.data[index] = job;
      }
    }
  }
}

module.exports = { JobRepository: JobRepositoryMock, JobMockData };
