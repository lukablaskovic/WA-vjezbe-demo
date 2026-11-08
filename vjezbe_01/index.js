// type = module (ES6 Javascript sintaksa)
import express from "express";

// type = commonjs
// const express = require("express");

const app = express();

// naglašavamo da će server obrađivati JSON body u zahtjevima koji dolaze
app.use(express.json());

let PORT = 8000;

app.get("/", (req, res) => {
  console.log("Pozvana je GET metoda na defaultnom endpointu!");
  res.status(200).send("Pozdrav iz Express.js servera!");
});

const pizze = [
  { id: 1, naziv: "Margherita", cijena: 6.5 },
  { id: 2, naziv: "Capricciosa", cijena: 8.0 },
  { id: 3, naziv: "Quattro formaggi", cijena: 10.0 },
  { id: 4, naziv: "Šunka sir", cijena: 7.0 },
  { id: 5, naziv: "Vegetariana", cijena: 9.0 },
];

// /pizze = množina, ovaj endpoint uvijek vraća polje svih pizza
app.get("/pizze", (req, res) => {
  console.log("Pozvana je GET metoda na /pizze endpointu!");
  return res.status(200).json(pizze); // 200 OK
});

// ULR parametar; koristi se za dohvat pojedinačnog (1) resursa
app.get("/pizze/:naziv", (req, res) => {
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

// validacija podataka u dolaznom HTTP zahtjevu

app.post("/pizze", (req, res) => {
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

// GET narudzbe; ako je polje prazno, vrati 404
// GET narudzbe/:id, ako id ne postoji, vrati 404
// POST narudzbe, ako korisnik proba naručit pizzu koja ne postoji, vrati 400

// DODATI U POSTMAN OBAVEZNO
// nova kolekcija:

let narudzbe = [];

app.get("/narudzbe", (req, res) => {
  if (!narudzbe.length) {
    return res.status(404).json({ message: "Nema narudžbi!" });
  }

  return res.status(200).json(narudzbe);
});

app.listen(PORT, () => {
  console.log(`Server jušto dela na ${PORT}!`);
});
