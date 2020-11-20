const Inventory = require("../models/inventory");
const { response } = require("express");
const { ObjectId } = require("mongodb");

const save = async (req, res = response) => {
  if (req.user.role === "ROLE_ADMINISTRATOR") {
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
  } else {
    return res.status(400).send({
      status: "error",
      msg: "No tienes permisos en la plataforma",
    });
  }
};
const update = (req, res = response) => {
  if (req.user.role === "ROLE_ADMINISTRATOR") {
    const { _id, weight, age_in_months } = req.body;
    console.log(_id);
    try {
      let update = {
        weight,
        age_in_months,
      };

      Inventory.findOneAndUpdate(
        { _id: _id },
        update,
        { new: true },
        (error, inventory) => {
          if (error) {
            return res.status(500).send({
              status: "error",
              msg: "Error en la peticion",
            });
          }

          if (!inventory) {
            return res.status(404).send({
              status: "error",
              msg: "No existe este animal",
            });
          }
          return res.status(200).send({
            status: "success",
            msg: "Editado correctamente",
            inventory: inventory,
          });
        }
      );
    } catch (error) {
      return res.status(500).json({
        status: "error",
        msg: "Por favor hable con el administrador",
      });
    }
  } else {
    return res.status(400).send({
      status: "error",
      msg: "No tienes permisos en la plataforma",
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
    limit: 2,
    page: page,
  };

  Inventory.paginate({ status: "en_finca" }, options, (err, inventory) => {
    if (err) {
      return res.status(500).send({
        status: "error",
        msg: "Error al hacer la consulta",
      });
    }

    if (!inventory) {
      return res.status(404).send({
        status: "error",
        msg: "Sin registros",
      });
    }

    return res.status(200).json({
      status: "success",
      data: {
        data: inventory.docs,
        count: inventory.totalDocs,
        totalPages: inventory.totalPages,
      },
    });
  });
};
//historicos de ventas
const getRecords = (req, res = response) => {
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
    limit: 3,
    page: page,
  };
  Inventory.paginate({ status: "vendidos" }, options, (err, inventory) => {
    if (err) {
      return res.status(500).send({
        status: "error",
        msg: "Error al hacer la consulta",
      });
    }
    if (!inventory) {
      return res.status(404).send({
        status: "error",
        msg: "Sin registros",
      });
    }
    return res.status(200).send({
      status: "success",
      data: {
        data: inventory.docs,
        count: inventory.totalDocs,
        totalPages: inventory.totalPages,
      },
    });
  });
};

const deleteOneInventory = (req, res = response) => {
  if (req.user.role === "ROLE_ADMINISTRATOR") {
    let inventoryId = req.body.id;

    Inventory.findOneAndDelete({ _id: inventoryId }, (err, inventory) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          msg: "Error al solicitar la peticion",
        });
      }
      if (!inventory) {
        return res.status(404).send({
          status: "error",
          msg: "No se ha borrado el inventario",
        });
      }
      return res.status(200).json({
        status: "success",
        msg: "Borrado de forma exitosa",
        inventory: inventory,
      });
    });
  } else {
    return res.status(400).send({
      status: "error",
      msg: "No tienes permisos en la plataforma",
    });
  }
};

const uploadImage = (req, res = response) => {
  if (req.user.role === "ROLE_ADMINISTRATOR") {
    if (!req.files) {
      return res.status(404).send({
        status: "error",
        msg: "Imagen del registro no subida...",
      });
    }

    const file_path = req.files.file0.path;

    // ** Adventencia ** En, Windows
    //var file_split = file_path.split('\\');

    const file_split = file_path.split("/");
    const file_name = file_split[2];
    const ext_split = file_name.split(".");
    const file_ext = ext_split[1];

    if (
      file_ext != "png" &&
      file_ext != "jpg" &&
      file_ext != "jpeg" &&
      file_ext != "gif"
    ) {
      fs.unlink(file_path, (err) => {
        return res.status(200).send({
          status: "error",
          msg: "La extension del archivo no es valida.",
        });
      });
    } else {
      const inventoryId = req.params.id;

      Inventory.findOneAndUpdate(
        { _id: inventoryId },
        { image: file_name },
        { new: true },
        (err, inventoryUpdated) => {
          if (err || !inventoryUpdated) {
            return res.status(500).send({
              status: "error",
              msg: "Error al guardar el registro",
            });
          }
          return res.status(200).send({
            status: "success",
            inventory: inventoryUpdated,
          });
        }
      );
    }
  } else {
    return res.status(400).send({
      status: "error",
      msg: "No tienes permisos en la plataforma",
    });
  }
};

const getInventoryFiles = (req, res = response) => {};

module.exports = {
  save,
  getInventoryByStatus,
  getRecords,
  deleteOneInventory,
  update,
  uploadImage,
  getInventoryFiles,
};
