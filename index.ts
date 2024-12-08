import express from "express";
import cors from "cors";
import { Application } from "express";
import { mainApp } from "./mainApp";
import { dbConfig } from "./utils/dbConfig";
import env from "dotenv";
env.config();

const app: Application = express();
app.use(express.json());
app.use(cors());
mainApp(app);

app.listen(parseInt(process.env.PORT as string), () => {
  dbConfig();
});
