
import express, { Application } from 'express';
import dotenv from 'dotenv';
import router from './routes/api.route';
import cors from 'cors';

dotenv.config();

const index: Application = express();
const port: number = 3000;

index.use(cors());
index.use(express.json()); 
index.use('/api', router);

// Start the server
index.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

index.get("/", (req, res) => {
    res.send("Hello World");
});