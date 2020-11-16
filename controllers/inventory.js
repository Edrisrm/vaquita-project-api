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

const getInventoryByStatus = (req, res = response) => {
  let page = undefined;

  if (
    !req.params.page ||
    req.params.page == 0 ||
    req.params.page == "0" ||
    req.params.page == null ||
    req.params.page == undefined
  ) {
    page = 1;
  } else {
    page = parseInt(req.params.page);
  }

  const options = {
    sort: { date: -1 },
    limit: 10,
    page: page,
  };

  Inventory.paginate({ status: "en_finca" }, options, (err, inventory) => {
    if (err) {
      return res.status(500).send({
        status: "error",
        message: "Error al hacer la consulta",
      });
    }

    if (!inventory) {
      return res.status(404).send({
        status: "error",
        message: "Sin registros",
      });
    }

    return res.status(200).send({
      status: "success",
      inventory: inventory.docs,
      totalDocs: inventory.totalDocs,
      totalPages: inventory.totalPages,
    });
  });
};
module.exports = {
  save,
  getInventoryByStatus,
};
