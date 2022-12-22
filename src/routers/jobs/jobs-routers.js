/* eslint-disable max-len */
const express = require('express');
/**
 *
 * @swagger
 *
 * definitions:
 *  Job:
 *    type: object
 *    properties:
 *      id:
 *        type: integer
 *        description: The Job ID.
 *        example: 0
 *      description:
 *        type: string
 *        description: The job description.
 *        example: work
 *      price:
 *        type: integer
 *        description: The price of the job.
 *        example: 299
 *      paid:
 *        type: boolean
 *        description: Shows if the Job has been paid
 *        example: true
 *      paymentDate:
 *        type: string
 *        description: The date in which the job was payed
 *        example: 2022-12-20T16:52:26.775Z
 *      ContractId:
 *        type: integer
 *        description: The job's ContractId.
 *        example: 1
 *      createdAt:
 *        type: string
 *        description: The job's creation date.
 *        example: 2022-12-20T16:52:26.775Z
 *      updatedAt:
 *        type: string
 *        description: The job's last update date.
 *        example: 2022-12-20T16:52:26.775Z
 *  UnpaidJobsResponse:
 *    type: array
 *    items:
 *      $ref: '#/definitions/Job'
 */

function JobsRouters(
  getUnpaidJobs,
  payJob,
  getContractById,
  transferBalance,
  dataSource,
  updateJobPayment,
) {
  const router = express.Router();
  /**
   * @swagger
   * /jobs/unpaid:
   *   get:
   *     summary: Get unpaid jobs
   *     tags:
   *      - Job
   *     description: Get all unpaid jobs for a user (***either*** a client or contractor), for ***active contracts only***.
   *     parameters:
   *       - name: profile_id
   *         in: header
   *         schema:
   *           type: integer
   *         description: user profile ID
   *     responses:
   *       200:
   *         description: 'List of unpaid jobs: UnpaidJobsResponse'
   *         content:
   *           application/json:
   *             schema:
   *              $ref: #/definitions/UnpaidJobsResponse
   */
  router.get('/unpaid', async (req, res) => {
    try {
      const { profile } = req;
      const unpaidJobs = await getUnpaidJobs.execute(profile);
      res.send(unpaidJobs);
    } catch (err) {
      res.status(500).send({ message: 'Error fetching data' });
    }
  });
  /**
   * @swagger
   * /jobs/{job_id}/pay:
   *   post:
   *     summary: Pay for a job
   *     tags:
   *      - Job
   *     description: Pay for a job, a client can only pay if his balance >= the amount to pay. The amount should be moved from the client's balance to the contractor balance.
   *     parameters:
   *       - name: job_id
   *         in: path
   *         description: Job Id to pay
   *         required: true
   *         schema:
   *           type: integer
   *       - name: profile_id
   *         in: header
   *         schema:
   *           type: integer
   *         description: user profile ID
   *         required: true
   *     responses:
   *       200:
   *         description: 'Job job_Id was succesfully payed.'
   *       500:
   *         description: Error message.
   *
   */
  router.post('/:job_id/pay', async (req, res) => {
    const transaction = await dataSource.transaction();
    try {
      const {
        profile,
        params: { job_id: jobId },
      } = req;
      const response = await payJob.execute(
        getContractById,
        transferBalance,
        updateJobPayment,
        jobId,
        profile,
        transaction,
      );
      await transaction.commit();
      return res.status(200).json({ message: response });
    } catch (err) {
      console.error(err.message);
      await transaction.rollback();
      return res
        .status(500)
        .send({ message: err.message || 'Error paying job' });
    }
  });
  return router;
}

module.exports = { JobsRouters };
