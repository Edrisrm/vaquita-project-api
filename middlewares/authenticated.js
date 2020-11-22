"use strict";

const jwt = require("jwt-simple");
const moment = require("moment");

exports.authenticated = function (req, res, next) {
  if (!req.headers.authorization) {
    return res.status(403).send({
      status: "error",
      msg: "La petición no tiene la cabecera de authorization",
    });
  }

  let token = req.headers.authorization.replace(/['"]+/g, "");

  try {
    var payload = jwt.decode(token, process.env.SECRET_JWT_SEED);

    if (payload.exp <= moment().unix()) {
      return res.status(404).send({
        status: "error",
        msg: "El token ha expirado",
      });
    }
  } catch (ex) {
    return res.status(404).send({
      status: "error",
      msg: "El token no es válido",
    });
  }

  req.user = payload;

  next();
};
