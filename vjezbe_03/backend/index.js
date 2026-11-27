import express from "express";
import pizzeRouter from "./routes/pizze.js";

import fs from "fs/promises";
import cors from "cors";

const app = express();

// dozvoli promet s bilo koje stranice
app.use(cors()); //middleware
app.use(express.json()); //middleware

app.use("/pizze", pizzeRouter);

// naglašavam da je callback asinkroni
app.get("/harrypotter", async (req, res) => {
  try {
    // asinkroni dio koda koji može potrajati, ali i puknuti
    let pričica = await fs.readFile("./data/harrypotter.txt", "utf-8");
    console.log(pričica);
    return res.status(200).json({ message: pričica });
  } catch (e) {
    // ako pukne, moram to obraditi
    return res
      .status(500)
      .json({ message: "Ups, nešto je pošlo po zlu!", error: e });
  }
});

let PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server jušto dela na ${PORT}!`);
});
