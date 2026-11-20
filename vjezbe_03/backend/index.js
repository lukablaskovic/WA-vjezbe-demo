import express from "express";
import pizzeRouter from "./routes/pizze.js";
import narudbzeRouter from "./routes/narudzbe.js";

const app = express();

app.use(express.json()); //middleware

app.use("/pizze", pizzeRouter);
app.use("/narudzbe", narudbzeRouter);

let PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server jušto dela na ${PORT}!`);
});
