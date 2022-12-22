const { ProfileMockRepository, profileMockData } = require("../__mocks__/profile/profile-repository.mock");
const { TransferBalance } = require("./transfer-balance");

const profileRepository = new ProfileMockRepository(profileMockData);

const transferBalance = new TransferBalance(profileRepository);

const destinationValidProfile = profileMockData[0];
const originValidProfile = profileMockData[3];
describe('test transferBalance use case', () => {
  it('should fail sending invalid transfer amount balance (null)', async () => {
    try {
      await transferBalance.execute(null, null, null);
    } catch (error) {
      expect(error.message).toBe('Invalid value to transfer.')
    }
  });
  it('should fail sending invalid transfer amount balance (string value)', async () => {
    try {
      await transferBalance.execute('some value', null, null);
    } catch (error) {
      expect(error.message).toBe('Invalid value to transfer.')
    }
  });
  it('should fail sending invalid profile origin (no profile)', async () => {
    try {
      await transferBalance.execute(10, null, null);
    } catch (error) {
      expect(error.message).toBe('The profile origin is needed to transfer.')
    }
  });
  it('should fail sending invalid profile origin (no profile balance)', async () => {
    try {
      await transferBalance.execute(10, { id: 1 }, null);
    } catch (error) {
      expect(error.message).toBe('The profile origin is invalid check the balance and the id.')
    }
  });
  it('should fail sending invalid profile destination id', async () => {
    try {
      await transferBalance.execute(10, originValidProfile, null);
    } catch (error) {
      expect(error.message).toBe('The profile destination is needed to transfer.')
    }
  });
  it('should fail sending invalid profile destination (not found)', async () => {
    try {
      await transferBalance.execute(10, originValidProfile, 10);
    } catch (error) {
      expect(error.message).toBe('Couldnot find the destination profile.')
    }
  });
  it('should fail transfering to the same profile', async () => {
    try {
      await transferBalance.execute(10, originValidProfile, originValidProfile.id);
    } catch (error) {
      expect(error.message).toBe('Cant trasnfer ballance to the same profile.')
    }
  });
  it('should fail transfering more than the available balance', async () => {
    try {
      await transferBalance.execute(originValidProfile.balance + 10, originValidProfile, destinationValidProfile.id);
    } catch (error) {
      expect(error.message).toBe('The client has less balance than the amount to transfer')
    }
  });
  it('should transfer balance correctly', async () => {
    const startOriginBalance = originValidProfile.balance
    const startDestinationBalance = destinationValidProfile.balance;
    const balanceToTransfer = 10;
    await transferBalance.execute(balanceToTransfer, originValidProfile, destinationValidProfile.id);
    expect(originValidProfile.balance).toEqual(startOriginBalance - balanceToTransfer);
    expect(destinationValidProfile.balance).toEqual(startDestinationBalance + balanceToTransfer);
  });
});