class ProfileRepository {
  profileDatasource;

  constructor(profileDatasource) {
    this.profileDatasource = profileDatasource;
  }

  async updateProfileBalance(
    profile, newBalance, transaction,
  ) {
    await profile.update({ balance: newBalance }, transaction);
    await profile.save({ transaction });
    return profile;
  }

  async getProfiles(where, transaction) {
    try {
      const all = await this.profileDatasource.findAll({ where }, transaction);
      return all;
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  }
}

module.exports = { ProfileRepository };
