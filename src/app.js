const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model');
const { getProfile } = require('./middleware/getProfile');
const { ContractsRouters } = require('./routers/contract/contracts-routers');
const { JobsRouters } = require('./routers/jobs/jobs-routers');
const { GetContractById } = require('./domain/use-cases/contract/get-contract-by-id');
const { GetContracts } = require('./domain/use-cases/contract/get-contracts');
const { ContractRepository } = require('./domain/repositories/contract-repository');
const { JobRepository } = require('./domain/repositories/job-repository');
const { GetUnpaidJobs } = require('./domain/use-cases/job/get-unpaid-jobs');
const { ProfileRepository } = require('./domain/repositories/profile-repository');
const { BalancesRouters } = require('./routers/balance/balances-routers');
const { DepositClientBalance } = require('./domain/use-cases/balance/deposit-client-balance');
const { TransferBalance } = require('./domain/use-cases/balance/transfer-balance');
const { PayJob } = require('./domain/use-cases/job/pay-job');
const { UpdateJobPayment } = require('./domain/use-cases/job/update-job-payment');
const { AdminRouters } = require('./routers/admin/admin-routers');
const { GetBestProfession } = require('./domain/use-cases/admin/get-best-profession');
const { AdminRepository } = require('./domain/repositories/admin-repository');
const { GetBestClients } = require('./domain/use-cases/admin/get-best-client');
const { swaggerUi, swaggerDocs } = require('./swagger');

const app = express();
app.use(bodyParser.json());
app.use(getProfile);
app.set('sequelize', sequelize);
app.set('models', sequelize.models);
const { Contract, Job, Profile } = sequelize.models;

// repositories
const contractRepo = new ContractRepository(Contract);
const jobsRepository = new JobRepository(Job);
const profileRepository = new ProfileRepository(Profile);
const adminRepository = new AdminRepository(sequelize);

// use cases
const getContractById = new GetContractById(contractRepo);
const getContracts = new GetContracts(contractRepo);

const getUnpaidJobs = new GetUnpaidJobs(jobsRepository, getContracts);
const updateJobPayment = new UpdateJobPayment(jobsRepository);
const payJob = new PayJob(jobsRepository, getContracts);

const depositClientBalance = new DepositClientBalance(profileRepository);
const transferBalance = new TransferBalance(profileRepository);

const getBestProfession = new GetBestProfession(adminRepository);
const getBestClients = new GetBestClients(adminRepository);

// routers
const contractRoutersMiddleware = ContractsRouters(getContractById,
  getContracts);

const jobsRoutersMiddleware = JobsRouters(
  getUnpaidJobs,
  payJob,
  getContractById,
  transferBalance,
  sequelize,
  updateJobPayment,
);

const balanceRoutersMiddleware = new BalancesRouters(
  depositClientBalance, getUnpaidJobs, transferBalance, sequelize,
);

const adminRoutersMiddleware = new AdminRouters(getBestProfession, getBestClients);

app.use('/balances', balanceRoutersMiddleware);
app.use('/contracts', contractRoutersMiddleware);
app.use('/jobs', jobsRoutersMiddleware);
app.use('/admin', adminRoutersMiddleware);
app.use(
  '/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs),
);

module.exports = app;
