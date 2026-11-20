import express from "express";
const router = express.Router();

let narudzbe = [
  { id: 1, pizza: "Margherita", kolicina: 2, cijena: 13.0 },
  { id: 2, pizza: "Capricciosa", kolicina: 2, cijena: 10.0 },
];

// GET /narudzbe
router.get("/", (req, res) => {
  if (narudzbe.length == 0) {
    return res.status(404).json({ message: "Nema narudžbi!!!!!!!!" });
  }
  return res.status(200).json(narudzbe);
});

// GET /narudzbe/:id
router.get("/:id", (req, res) => {
  const id_param = req.params.id;
  let trazena_narudzba = narudzbe.find((narudzba) => narudzba.id == id_param);
  if (!trazena_narudzba) {
    console.log("Tražena narudžba ne postoji.");
    return res.status(404).json({ message: "Tražena narudžba ne postoji." });
  }
  return res.status(200).json(trazena_narudzba);
});

export default router;
