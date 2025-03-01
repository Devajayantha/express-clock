
import express, { Application } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const index: Application = express();
const port: number = 3000;

// Start the server
index.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

index.get("/", (req, res) => {
    res.send("Hello World");
});