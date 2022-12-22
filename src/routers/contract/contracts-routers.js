/* eslint-disable max-len */
const express = require('express');

/**
 *
 * @swagger
 * definitions:
 *  ContractResponse:
 *    type: object
 *    properties:
 *      id:
 *        type: integer
 *        description: The contract ID.
 *        example: 0
 *      terms:
 *        type: string
 *        description: The contract's terms.
 *        example: Some terms
 *      status:
 *        type: string
 *        description: The contract's status.
 *        example: in_progress
 *      ContractorId:
 *        type: integer
 *        description: The contract's Contractor Id.
 *        example: 1
 *      ClientId:
 *        type: integer
 *        description: The contract's Client ID.
 *        example: 2
 *      createdAt:
 *        type: string
 *        description: The contract's creation date.
 *        example: 2022-12-20T16:52:26.775Z
 *      updatedAt:
 *        type: string
 *        description: The contract's last update date.
 *        example: 2022-12-20T16:52:26.775Z
 *  ContractListResponse:
 *    type: array
 *    items:
 *      $ref: '#/definitions/ContractResponse'
 */

function ContractsRouters(getContractById,
  getContracts) {
  const router = express.Router();

  /**
 * @swagger
 * /contracts/{id}:
 *   get:
 *     summary: Gets a contract by id
 *     tags:
 *      - Contract
 *     description:  return the contract only if it belongs to the profile calling.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: contract ID to retrieve
 *         schema:
 *           type: integer
 *         required: true
 *       - name: profile_id
 *         in: header
 *         schema:
 *           type: integer
 *         description: user profile ID
 *         required: true
 *     responses:
 *       200:
 *         description: A single contract.
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/definitions/ContractResponse'
 *
*/

  router.get('/:id', async (req, res) => {
    try {
      const { profile, params: { id } } = req;
      const contracts = await getContractById.execute(profile, id);
      return res.send(contracts);
    } catch (err) {
      return res.status(500).send({ message: err?.message || 'Error fetching data' });
    }
  });
  /**
 * @swagger
 * /contracts:
 *   get:
 *     summary: Return active contracts
 *     tags:
 *      - Contract
 *     description: Returns a list of contracts belonging to a user (client or contractor), the list should only contain non terminated contracts
 *     parameters:
 *       - name: profile_id
 *         in: header
 *         schema:
 *           type: integer
 *         description: user profile ID
 *         required: true
 *     responses:
 *       200:
 *         description: List of non terminated Contracts
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/definitions/ContractListResponse'
*/
  router.get('/', async (req, res) => {
    try {
      const { profile } = req;
      const contacts = await getContracts.execute(profile);
      res.send(contacts);
    } catch (err) {
      res.status(500).send({ message: err?.message || 'Error fetching data' });
    }
  });

  return router;
}

module.exports = { ContractsRouters };
