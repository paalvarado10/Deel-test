const { QueryTypes } = require('sequelize');

class AdminRepository {
  dataSource;

  constructor(dataSource) {
    this.dataSource = dataSource;
  }

  async getBestProfession(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const result = await this.dataSource.query(`
    SELECT profession, SUM(price) as totalPrice FROM Jobs
    INNER JOIN
    Contracts ON Contracts.id = Jobs.ContractId
    INNER JOIN Profiles ON Profiles.id = Contracts.ContractorId
    WHERE paymentDate BETWEEN '${start.toISOString()}' AND '${end.toISOString()}'
    Group by profession
    order by SUM(price) desc
    Limit 1
    `, { type: QueryTypes.SELECT });
    return result[0];
  }

  async getBestClients(
    startDate, endDate, limit,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const result = await this.dataSource.query(`
    SELECT Profiles.id, Profiles.firstName || ' ' ||  Profiles.lastName as fullName, SUM(price) as paid FROM Jobs
    INNER JOIN
    Contracts ON Contracts.id = Jobs.ContractId
    INNER JOIN Profiles ON Profiles.id = Contracts.ClientId
    WHERE paymentDate BETWEEN '${start.toISOString()}' AND '${end.toISOString()}'
    Group by Profiles.id
    order by SUM(price) desc
    Limit ${limit}
    `, { type: QueryTypes.SELECT });
    return result;
  }
}

module.exports = { AdminRepository };
