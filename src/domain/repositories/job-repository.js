const { Op } = require('sequelize');

class JobRepository {
  jobDatasource;

  constructor(jobDatasource) {
    this.jobDatasource = jobDatasource;
  }

  async getUnpayedJobs(contractIds) {
    return this.jobDatasource.findAll({
      where: {
        paid: {
          [Op.not]: true,
        },
        ContractId: {
          [Op.in]: contractIds,
        },
      },
    });
  }

  async getJobs(where, transaction) {
    return this.jobDatasource.findAll({ where }, transaction);
  }

  async updatePayment(jobToUpdate, transaction) {
    jobToUpdate.update({ paid: true, paymentDate: new Date() });
    await jobToUpdate.save({ transaction });
  }
}

module.exports = { JobRepository };
