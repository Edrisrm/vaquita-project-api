const Apart = require("../models/apart");

const { response } = require("express");

const save = async (req, res = response) => {
  if (req.user.role === "ROLE_ADMINISTRATOR") {
    const { square_meter, apart_number } = req.body;
    try {
      let apart = new Apart();
      apart.square_meter = square_meter;
      apart.apart_number = apart_number;
      apart.save();

      return res.status(200).json({
        status: "success",
        msg: "Agregado correctamente",
        apart: apart,
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

const getAparts = (req, res = response) => {
  Apart.find().exec((err, aparts) => {
    if (err || !aparts) {
      return res.status(404).send({
        status: "error",
        msg: "No hay apartados actualmente",
      });
    }

    return res.status(200).json({
      status: "success",
      aparts: aparts,
    });
  });
};
const deleteOneApart = (req, res = response) => {
  if (req.user.role === "ROLE_ADMINISTRATOR") {
    let apartId = req.body.id;
    Apart.findOneAndDelete({ _id: apartId }, (err, apart) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          msg: "Error al solicitar la peticion",
        });
      }
      if (!apart) {
        return res.status(404).send({
          status: "error",
          msg: "No se ha borrado el aparto",
        });
      }
      return res.status(200).json({
        status: "success",
        msg: "Borrado de forma exitosa",
        apart: apart,
      });
    });
  } else {
    return res.status(400).send({
      status: "error",
      msg: "No tienes permisos en la plataforma",
    });
  }
};

const deleteManyApart = (req, res = response) => {
  const { data } = req.body;

  data.forEach(function (element) {
    Apart.findOneAndDelete({ _id: element._id }, (err) => {
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
    msg: "Apartos eliminados",
  });
};

module.exports = {
  save,
  getAparts,
  deleteOneApart,
  deleteManyApart,
};
