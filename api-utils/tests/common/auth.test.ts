import { Auth } from '../../src/common/auth';

describe('Auth', () => {
  const password = 'SuperSecret123!';
  let hashedPassword: string;

  it('should hash a password correctly', async () => {
    const saltRounds = 10;
    hashedPassword = await Auth.hash(password, saltRounds);

    expect(typeof hashedPassword).toBe('string');
    expect(hashedPassword).not.toBe(password);
    expect(hashedPassword.length).toBeGreaterThan(0);
  });

  it('should return true when comparing correct password', async () => {
    const result = await Auth.compare(password, hashedPassword);
    expect(result).toBe(true);
  });

  it('should return false when comparing incorrect password', async () => {
    const result = await Auth.compare('WrongPassword', hashedPassword);
    expect(result).toBe(false);
  });
});
