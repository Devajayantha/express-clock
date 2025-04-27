
import express, { Application } from 'express';
import dotenv from 'dotenv';
import router from './routes/apiRoute';
import routerDoc from './routes/apiDocRoute';
import cors from 'cors';

dotenv.config();

const index: Application = express();
const port: number = Number(process.env.PORT) || 3000;

index.use(cors());
index.use(express.json()); 
index.use('/api', router);
index.use('/api-doc', routerDoc);

// Start the server
index.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});