"use strict";
const Inventory = require("../models/inventory");
const { response } = require("express");

const save = (req, res = response) => {
  const { breed, weight, age_in_months, division } = req.body;
  try {
    let inventory = new Inventory();

    inventory.breed = breed;
    inventory.weight = weight;
    inventory.age_in_months = age_in_months;
    inventory.division = division;
    inventory.status = "en_finca";
    inventory.image = "Without image";
    inventory.save();

    return res.status(200).json({
      status: "success",
      msg: "Agregado correctamente",
      inventory: inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      msg: "Por favor hable con el administrador",
    });
  }
};

module.exports = {
  save,
};
