import { authRouter } from './routs/routs.auth.js';
import express from 'express';
import bodyParser from 'body-parser';
import { AuthController } from './controllers/controllet.auth.js';
import { AuthService } from './services/service.auth.js';
import { User } from './models/User.js';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const STORAGE_PATH = __dirname;
console.log(1);


const app = express();

app.use(bodyParser.json());

app.use('/user', authRouter(
  new AuthController(
    new AuthService(
      new User(STORAGE_PATH)))));


app.listen(3000);
