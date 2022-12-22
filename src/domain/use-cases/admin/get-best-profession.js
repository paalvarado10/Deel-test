class GetBestProfession {
  adminRepository;

  constructor(adminRepository) {
    this.adminRepository = adminRepository;
  }

  async execute(startDate, endDate) {
    const bestProfession = await this.adminRepository.getBestProfession(startDate || new Date(
      1, 1, 1,
    ), endDate || new Date());
    return bestProfession;
  }
}

module.exports = { GetBestProfession };
