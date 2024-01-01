import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import  router  from './routes/routes.js'

import dotenv from 'dotenv';
dotenv.config();

const app = express();



app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello");
});
app.use('/api', router);

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once('connected', () => {
    console.log('Database Connected');
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on: ${process.env.PORT}`);
});
