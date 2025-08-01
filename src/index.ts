import express from "express";
import { API_DEFAULT_PORT } from "./constants";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT || API_DEFAULT_PORT;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hola mundo desde Express + TypeScript");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${API_DEFAULT_PORT}`);
});
