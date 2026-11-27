import express from "express";
import fs from "fs/promises";

//import pizze from "../data/pizze.js";

// zadatak je zamijeniti in-memory pristup dohvacanja pizza
// sa pristupom preko citanja datoteke pizze.json (fs/promises)

const router = express.Router();

// ovo se poziva kada refresham frontend
router.get("/", async (req, res) => {
  try {
    let pizze = await fs.readFile("./data/pizze.json", "utf-8");
    let pizze_js = JSON.parse(pizze); // pretvaram JSON u JS

    console.log("Dohvaćene pizze:", pizze_js);

    // JSON.parse pretvara JSON u JS
    // JSON.stringify pretvara JS u JSON
    return res.status(200).json(pizze_js); // vratimo klijentu
  } catch (greskica) {
    if (greskica) {
      console.error("Greška prilikom čitanja datoteke pizze.json: ", greskica);
    }

    return res
      .status(500)
      .json({ message: "Ups nešto je pošlo po zlu!", error: greskica });
  }
});

router.get("/:naziv", (req, res) => {
  let naziv_param = req.params.naziv;

  // Bad Request (400): korisnik šalje podatke u krivom formatu
  if (!isNaN(naziv_param)) {
    return res.status(400).json({ message: "Naziv pizze mora biti string!" });
  }

  let pizza = pizze.find(
    (p) => p.naziv.toLocaleLowerCase() == naziv_param.toLocaleLowerCase(),
  );

  if (!pizza) {
    return res.status(404).json({ message: "Tražena pizza ne postoji!" });
  }

  return res.status(200).json(pizza);
});

router.post("/", (req, res) => {
  let nova_pizza = req.body; // naziv, cijena

  let pizza_postoji = pizze.find(
    (pizza) =>
      pizza.naziv.toLocaleLowerCase() == nova_pizza.naziv.toLocaleLowerCase(),
  );

  if (pizza_postoji) {
    return res
      .status(409)
      .json({ message: "Pizza s tim nazivom već postoji!" });
  }
  // else pizza postoji, dodaj ju...
  let novi_id = pizze.at(-1).id + 1;
  nova_pizza.id = novi_id;
  pizze.push(nova_pizza);
  return res.status(201).json({ message: "Pizza je dodana!", pizze: pizze });
});

export default router;
