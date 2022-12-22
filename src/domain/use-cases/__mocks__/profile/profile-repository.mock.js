/* eslint-disable no-unused-vars */
class ProfileMockRepository {
  profileDataSource;

  constructor(profileDataSource) {
    this.profileDataSource = profileDataSource || [];
  }

  async updateProfileBalance(
    profile, newBalance, transaction,
  ) {
    let profileUpdated;
    for (let index = 0; index < this.profileDataSource.length; index += 1) {
      const profileToUpadte = this.profileDataSource[index];
      if (profile.id === profileToUpadte.id) {
        profileUpdated = profileToUpadte;
        profileUpdated.balance = newBalance;
        this.profileDataSource[index] = profileUpdated;
      }
    }
    return profileUpdated;
  }

  async getProfiles(where, transaction) {
    const { id } = where;
    return this.profileDataSource.filter((profile) => profile.id === id);
  }
}

const profileMockData = [
  {
    id: 1,
    firstName: 'Andres',
    lastName: 'Parra',
    profession: 'Software Engineer',
    balance: 0,
    type: 'contractor',
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Doe',
    profession: 'Marketing',
    balance: 0,
    type: 'contractor',
  },
  {
    id: 3,
    firstName: 'Jhon',
    lastName: 'Parra',
    profession: 'Painter',
    balance: 0,
    type: 'contractor',
  },
  {
    id: 4,
    firstName: 'Christina',
    lastName: 'Yang',
    profession: 'Doctor',
    balance: 120,
    type: 'client',
  },
  {
    id: 5,
    firstName: 'Paco',
    lastName: 'Mendez',
    profession: 'Software Engineer',
    balance: 140,
    type: 'client',
  },
  {
    id: 6,
    firstName: 'June',
    lastName: 'Austen',
    profession: 'Doctor',
    balance: 160,
    type: 'client',
  },
];

module.exports = { ProfileMockRepository, profileMockData };
