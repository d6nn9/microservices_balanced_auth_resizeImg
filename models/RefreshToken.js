import path from 'path';
import fs from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';


export class RefreshToken {
  constructor(storage) {
    this.storage = path.join(storage, 'refreshTokens');
    const storageIsExist = existsSync(this.storage);
    if (!storageIsExist) {
      mkdirSync(this.storage);
    }
  }

  async get(refreshToken) {
    const tokenRecords = await fs.readdir(this.storage);
    let email;
    for (const record of tokenRecords) {
      const [recordEmail, recordToken] = record.split(' ');
      if (recordToken === refreshToken) {
        email = recordEmail;
        break;
      }
    }

    if (!email) {
      throw new Error('Refresh token was not found.');
    }

    return { refreshToken, email };
  }

  async add({ refreshToken, email }) {
    const savePath = path.join(
      this.storage,
      `${email} ${refreshToken}`,
    );

    await fs.writeFile(savePath, '');
  }

  async delete(query) {
    const queryFields = ['email', 'refreshToken'];
    const filenamePart = query.storage ? 1 : 0;
    const searchField = queryFields[filenamePart];
    const tokenRecords = await fs.readdir(this.storage);
    let tokenPath;

    for (const record of tokenRecords) {
      const currentValue = record.split(' ')[filenamePart];
      if (currentValue === query[searchField]) {
        tokenPath = path.join(this.storage, record);
        await fs.unlink(tokenPath);
      }
    }

    if (!tokenPath) {
      throw new Error('Refresh token was not found.');
    }
  }
}
