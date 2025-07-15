import bcrypt from 'bcrypt';

export class Auth {
  static hash = async (text: string, saltOrRounds: string | number): Promise<string> =>
    bcrypt.hash(text, saltOrRounds);

  static compare = async (text: string, hashedText: string): Promise<boolean> =>
    bcrypt.compare(text, hashedText);
}
