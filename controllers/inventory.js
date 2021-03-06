const Inventory = require("../models/inventory");
const { response } = require("express");
const { ObjectId } = require("mongodb");
var path = require("path");
var fs = require("fs");

const save = async (req, res = response) => {
  if (req.user.role === "ROLE_ADMINISTRATOR") {
    const { breed, weight, age_in_months, apartValue } = req.body;
    try {
      let inventory = new Inventory();

      inventory.breed = breed;
      inventory.weight = weight;
      inventory.age_in_months = age_in_months;
      inventory.apart = apartValue;
      inventory.status = "en_finca";
      inventory.image = null;
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
    limit: 9,
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
    limit: 10,
    page: page,
  };
  Inventory.paginate({ status: "vendido" }, options, (err, inventory) => {
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

const updateStatus = (req, res = response) => {
  if (req.user.role === "ROLE_ADMINISTRATOR") {
    const { data } = req.body;
    data.forEach(function (element) {
      Inventory.findOneAndUpdate(
        { _id: element._id },
        { status: "vendido" },
        (err) => {
          if (err) {
            return res.status(500).send({
              status: "error",
              msg: "Error en la operacion",
            });
          }
        }
      );
    });

    return res.status(200).send({
      status: "success",
      msg: "Todos los animales como vendidos",
    });
  } else {
    return res.status(400).send({
      status: "error",
      msg: "No tienes permisos en la plataforma",
    });
  }
};

const deleteManyInventory = (req, res = response) => {
  if (req.user.role === "ROLE_ADMINISTRATOR") {
    const { data } = req.body;

    data.forEach(function (element) {
      Inventory.findOneAndDelete({ _id: element._id }, (err) => {
        if (err) {
          return res.status(500).send({
            status: "error",
            msg: "Error en la operacion",
          });
        }
      });
    });
    return res.status(200).send({
      status: "success",
      msg: "Registros eliminados",
    });
  } else {
    return res.status(400).send({
      status: "error",
      msg: "No tienes permisos en la plataforma",
    });
  }
};

const uploadImage = (req, res) => {
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
            msg: "Imagen actualizada en el registro",
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

const getInventoryFiles = (req, res = response) => {
  var fileName = req.params.fileName;
  var pathFile = "./uploads/inventory/" + fileName;

  fs.exists(pathFile, (exists) => {
    if (exists) {
      return res.sendFile(path.resolve(pathFile));
    } else {
      return res.status(404).send({
        msg: "La imagen no existe",
      });
    }
  });
};

module.exports = {
  save,
  getInventoryByStatus,
  getRecords,
  deleteOneInventory,
  update,
  uploadImage,
  getInventoryFiles,
  updateStatus,
  deleteManyInventory,
};
