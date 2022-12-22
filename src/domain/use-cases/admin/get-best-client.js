class GetBestClients {
  adminRepository;

  constructor(adminRepository) {
    this.adminRepository = adminRepository;
  }

  async execute(
    startDate, endDate, limit = 2,
  ) {
    const jobsDuringDate = await this.adminRepository.getBestClients(
      startDate || new Date(
        1, 1, 1,
      ), endDate || new Date(), limit,
    );
    return jobsDuringDate;
  }
}

module.exports = { GetBestClients };
