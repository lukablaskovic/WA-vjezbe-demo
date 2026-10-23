// type = module (ES6 Javascript sintaksa)
import express from "express";

// type = commonjs
// const express = require("express");

const app = express();

let PORT = 8000;

// poslužitelj sluša na PORTU 8000
app.listen(PORT, () => {
  console.log(`Server jušto dela na ${PORT}!`);
});
