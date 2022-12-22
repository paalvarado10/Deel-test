/* eslint-disable max-len */
const express = require('express');

function AdminRouters(getBestProfession,
  getBestClients) {
  const router = express.Router();
  /**
 *
 * @swagger
 * definitions:
 *  BestProfessionResponse:
 *    type: object
 *    properties:
 *      profession:
 *        type: string
 *        description: The profession name.
 *        example: 'Developer'
 *      totalPrice:
 *        type: integer
 *        description: The total price won.
 *        example: 2000
 *  BestClientResponseItem:
 *    type: object
 *    properties:
 *      id:
 *        type: integer
 *        description: ClientId.
 *        example: 1
 *      fullName:
 *        type: string
 *        description: the client full name
 *        example: 'Jon Doe'
 *      paid:
 *        type: integer
 *        description: The total paid by the client.
 *        example: 2000
 *
 *  BestClientResponse:
 *    type: array
 *    items:
 *      $ref: '#/definitions/BestClientResponseItem'
 */

  /**
 * @swagger
 * /admin/best-profession:
 *   get:
 *     summary: Get best profession in the given date range
 *     tags:
 *      - Admin
 *     description: Returns the profession that earned the most money (sum of jobs paid) for any contactor that worked in the query time range.
 *     parameters:
 *       - name: start
 *         in: query
 *         description: start date to filter
 *         schema:
 *           type: string
 *         required: true
 *       - name: end
 *         in: query
 *         description: end date to filter
 *         schema:
 *           type: string
 *         required: true
 *       - name: profile_id
 *         in: header
 *         schema:
 *           type: integer
 *         required: true
 *         description: user profile ID
 *     responses:
 *       200:
 *         description: Returns the best paid profession name and de total price paid BestProfessionResponse
 *       500:
 *         description: Error message.
 *
*/
  router.get('/best-profession', async (req, res) => {
    try {
      const { query: { start: startDate, end: endDate } } = req;
      const errorToShow = (date) => `The ${date} is required to filter the data.`;
      if (!startDate) throw new Error(errorToShow('start date'));
      if (!endDate) throw new Error(errorToShow('end date'));
      const bestProfession = await getBestProfession.execute(new Date(startDate),
        new Date(endDate));
      return res.send(bestProfession);
    } catch (err) {
      return res.status(500).send({ message: err.message || 'Error fetching data' });
    }
  });

  /**
 * @swagger
 * /admin/best-clients:
 *   get:
 *     summary: Get best client in the given date range
 *     tags:
 *      - Admin
 *     description: returns the clients the paid the most for jobs in the query time period. limit query parameter should be applied, default limit is 2.
 *     parameters:
 *       - name: start
 *         in: query
 *         description: start date to filter
 *         schema:
 *           type: string
 *         required: true
 *       - name: end
 *         in: query
 *         description: end date to filter
 *         schema:
 *           type: string
 *         required: true
 *       - name: limit
 *         in: query
 *         description: number of records to retrieve
 *         schema:
 *           type: integer
 *       - name: profile_id
 *         in: header
 *         schema:
 *           type: integer
 *         required: true
 *         description: user profile ID
 *     responses:
 *       200:
 *         description: 'List of the best clients: BestClientResponse'
 *       500:
 *         description: Error message.
*/
  router.get('/best-clients', async (req, res) => {
    try {
      const { query: { start: startDate, end: endDate, limit } } = req;
      const errorToShow = (date) => `The ${date} is required to filter the data.`;
      if (!startDate) throw new Error(errorToShow('start date'));
      if (!endDate) throw new Error(errorToShow('end date'));
      const bestClients = await getBestClients.execute(
        new Date(startDate), new Date(endDate), limit,
      );
      return res.send(bestClients);
    } catch (err) {
      return res.status(500).send({ message: err.message || 'Error fetching data' });
    }
  });
  return router;
}

module.exports = { AdminRouters };
