const Inventory = require("../models/inventory");
const { response } = require("express");
const { ObjectId } = require("mongodb");

const save = async (req, res = response) => {
  const { breed, weight, age_in_months, division } = req.body;
  try {
    let inventory = new Inventory();

    inventory.breed = breed;
    inventory.weight = weight;
    inventory.age_in_months = age_in_months;
    inventory.division = division;
    inventory.status = "en_finca";
    inventory.image = "Without image";
    await inventory.save();

    await Inventory.findById(ObjectId(inventory._id))
      .then((get_inventory) => {
        console.log(get_inventory);
        return res.status(200).json({
          status: "success",
          msg: "Agregado correctamente",
          inventory: get_inventory,
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).send({
          msg: "Por favor hable con el administrador",
        });
      });
  } catch (error) {
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
    limit: 5,
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
