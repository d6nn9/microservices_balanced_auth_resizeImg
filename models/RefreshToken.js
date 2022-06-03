import path from 'path';
import fs from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import { cashStorage } from '../lochal.storages/refresh.token.set.js';


export class RefreshToken {
  constructor(storage) {
    this.cashStorage = cashStorage;
    this.storage = path.join(storage, 'refreshTokens');
    const storageIsExist = existsSync(this.storage);
    if (!storageIsExist) {
      mkdirSync(this.storage);
    }
  }

  async get(refreshToken) {
    const hasTokenInCash = this.cashStorage.has(`${refreshToken}`);
    if (hasTokenInCash) {
      return { refreshToken };
    }
    const getPath = path.join(this.storage, `${refreshToken}`);
    const tokenRecords = await fs.readFile(getPath, { encoding: 'utf8' });
    fs.unlink(getPath);
    // console.log(tokenRecords);
    // for (const record of tokenRecords) {
    //   if (record === refreshToken) {
    //     return { refreshToken };
    //   }
    // }
    const [email] = tokenRecords.split(' ');
    return { email };
    // throw new Error('Refresh token was not found.');
  }

  async add(refreshToken, { email }) {
    const savePath = path.join(this.storage, `${refreshToken}`);
    await fs.writeFile(savePath, `${email}`);
    this.cashStorage.add(`${refreshToken}`);
  }

  // async refresh(refreshToken) {
  //   const payload = await this.get(refreshToken);
  // }
}
