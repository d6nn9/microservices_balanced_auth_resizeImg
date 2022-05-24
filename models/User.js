import path from 'path';
import fs from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import argon2 from 'argon2';

export class User {
  constructor(storage) {
    this.storage = path.join(storage, 'users');
    const storageIsExist = existsSync(this.storage);
    if (!storageIsExist) {
      mkdirSync(this.storage);
    }
  }

  async emailIsExist(email) {
    try {
      const userPath = path.join(this.storage, email);
      await fs.access(userPath);
      return true;
    } catch (error) {
      return false;
    }
  }

  async getByEmail(userData) {
    const { email, password } = userData;
    const userPath = path.join(this.storage, email);
    try {
      const hashedPassword = await fs.readFile(userPath, 'utf8',);
      const correctPassword = await argon2.verify(hashedPassword, password);
      if (correctPassword) {
        return { email, password: hashedPassword };
      }
    } catch (error) {
      throw new Error(`The user with the email ${email} was not found.`);
    }
    throw new Error('Password is not correct');
  }

  async create(userData) {
    const { email, password } = userData;
    const exist = await this.emailIsExist(email);
    if (exist) {
      throw new Error(`The user with the email "${email}" already exists`);
    }
    const hashedPassword = await argon2.hash(password);
    const passForSave = path.join(this.storage, email);
    await fs.writeFile(passForSave, hashedPassword);
    return { email, hashedPassword };
  }
}
