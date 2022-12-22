/* eslint-disable max-len */
const express = require('express');

function BalancesRouters(
  depositClientBalance,
  getUnpaidJobs,
  transferBalance,
  dataSource,
) {
  const router = express.Router();
  /**
 * @swagger
 * /balances/{userId}:
 *   post:
 *     summary: Deposits money into the the the balance of a client
 *     tags:
 *      - Balance
 *     description: A client can't deposit more than 25% his total of jobs to pay. (at the deposit moment)
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: contractor ID to deposit the money
 *         required: true
 *         schema:
 *           type: integer
 *       - name: profile_id
 *         in: header
 *         schema:
 *           type: integer
 *         description: user profile ID
 *         required: true
 *       - name: body
 *         in: body
 *         schema:
 *          type: object
 *          properties:
 *            amount:
 *              type: integer
 *              example: 10
 *              required: true
 *              description: amount to deposit
 *     responses:
 *       200:
 *         description: A succes message.
 *       500:
 *         description: Error message.
 *
*/
  router.post('/deposit/:userId', async (req, res) => {
    const transaction = await dataSource.transaction();
    try {
      const { profile, params: { userId }, body: { amount } } = req;
      if (!amount || Number.isNaN(Number(amount))) throw new Error('amount value is required and must be a number');
      if (Number(userId) !== Number(profile.id)) throw new Error('Invalid user id');
      const response = await depositClientBalance.execute(
        getUnpaidJobs, profile, amount, transaction,
      );
      await transaction.commit();
      res.statusCode = 201;
      return res.json(response);
    } catch (err) {
      await transaction.rollback();
      console.error(err.message);
      return res.status(500).send({ message: err.message || 'Error in the deposit' });
    }
  });

  return router;
}

module.exports = { BalancesRouters };
