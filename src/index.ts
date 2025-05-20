
import express, { Application, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import router from './routes/apiRoute';
import routerDoc from './routes/apiDocRoute';
import cors from 'cors';

enum Environment {
    LOCAL = 'local',
    DEV = 'debug',
    PROD = 'production'
}

dotenv.config();

const index: Application = express();
const port: number = Number(process.env.PORT) || 3000;
const debug: boolean = process.env.DEBUG === 'true';
const env: Environment = process.env.ENV as Environment || Environment.LOCAL;

index.use(cors());
index.use(express.json()); 

switch (env) {
  case Environment.LOCAL:
    console.log('Running in local environment');
    if (debug) {
      index.use((req: Request, res: Response, next: NextFunction) => {
        console.log(`[DEBUG] ${req.method} ${req.url}`);
        next();
      });
    }
    break;

  case Environment.DEV:
    console.log('Running in development environment');
    if (debug) {
      index.use((req: Request, res: Response, next: NextFunction) => {
        console.log(`[DEBUG] ${req.method} ${req.url}`);
        next();
      });
    }
    break;

  case Environment.PROD:
    console.log('Running in production environment');
    break;

  default:
    console.error('Unknown environment. Please set ENV to local, dev, or prod.');
    process.exit(1);
}

index.use('/api', router);
index.use('/api-doc', routerDoc);

// Start the server
index.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});