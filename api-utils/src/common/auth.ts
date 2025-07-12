import bcrypt from "bcrypt";

export class Auth {
  static hash = async (text: string, secreatHash: string): Promise<string> =>
    bcrypt.hash(text, secreatHash);

  static compare = async (text: string, hashedText: string): Promise<boolean> =>
    bcrypt.compare(text, hashedText);
}
