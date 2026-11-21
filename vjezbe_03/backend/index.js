import express from "express";
import pizzeRouter from "./routes/pizze.js";

import cors from "cors";

const app = express();

// dozvoli promet s bilo koje stranice
app.use(cors()); //middleware
app.use(express.json()); //middleware

app.use("/pizze", pizzeRouter);

let PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server jušto dela na ${PORT}!`);
});
