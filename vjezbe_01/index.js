// type = module (ES6 Javascript sintaksa)
import express from "express";

// type = commonjs
// const express = require("express");

const app = express();

let PORT = 8000;

// RUTA/endpoint = "/" (root ruta, defaultni endpoint)
// HTTP metoda = GET
// prvi param = HTTP request (zahtjev)
// drugi param = HTTP response (odgovor)
app.get("/", (req, res) => {
  console.log("Pozvana je GET metoda na defaultnom endpointu!");
  res.send("Pozdrav iz Express.js servera!");
});

// ovo je spremljeno u stvarnosti u DB (skoro nikad na serveru)
// ovo je in-memory data (podaci spremljeni u memoriji servera)
let pizze = [
  { id: 1, naziv: "Margherita", cijena: 35 },
  { id: 2, naziv: "Capricciosa", cijena: 45 },
  { id: 3, naziv: "Quattro Formaggi", cijena: 50 },
];

// HTTP klijent (web preglednik) šalje HTTP GET zahtjev na Express.js poslužitelj GET /pizze
app.get("/pizze", (req, res) => {
  console.log("Pozvana je GET metoda na /pizze endpointu!");
  res.json(pizze);
});

// poslužitelj sluša na PORTU 8000
app.listen(PORT, () => {
  console.log(`Server jušto dela na ${PORT}!`);
});
