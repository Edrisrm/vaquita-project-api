const { response } = require("express");
const { OAuth2Client } = require("google-auth-library");
const { createToken } = require("../helpers/jwt");

const speakeasy = require("speakeasy");
const User = require("../models/user");

const oAuth2Client = new OAuth2Client(process.env.GOOGLE_ID);

const register_login_google = (req, res = response) => {
  const { idToken } = req.body;

  oAuth2Client
    .verifyIdToken({ idToken: idToken, audience: process.env.GOOGLE_ID })
    .then((response) => {
      const {
        email,
        email_verified,
        given_name,
        family_name,
      } = response.getPayload();

      if (email_verified) {
        try {
          User.findOne({ email: email.toLowerCase() }, (err, get_user) => {
            if (err) {
              return res.status(500).send({
                status: "error",
                msg: "Error algo salio mal",
              });
            }

            if (get_user) {
              return res.status(200).send({
                status: "success",
                msg: "Es un gusto tenerte de nuevo en Vaquita Web",
                user: {
                  id: get_user._id,
                  email: get_user.email,
                  given_name: get_user.given_name,
                  family_name: get_user.family_name,
                  role: get_user.role,
                  two_factors_activated: get_user.two_factors_activated,
                },
              });
            } else {
              let user = new User();

              user.email = email.toLowerCase();
              user.given_name = given_name;
              user.family_name = family_name;
              user.role = "ROLE_VIEWER";
              user.secret_key = speakeasy.generateSecret().base32;
              user.two_factors_activated = false;

              user.save();

              res.status(200).json({
                status: "success",
                msg: "Bienvenido a nuestra plataforma Vaquita Web",
                secret_key: user.secret_key,
                user: {
                  id: user._id,
                  email: user.email,
                  given_name: user.given_name,
                  family_name: user.family_name,
                  role: user.role,
                  two_factors_activated: user.two_factors_activated,
                },
              });
            }
          });
        } catch (error) {
          res.status(500).json({
            status: "error",
            msg: "Por favor hable con el administrador",
          });
        }
      } else {
        return res.status(500).send({
          status: "error",
          msg: "Primero verifica tu correo",
        });
      }
    })
    .catch(() => {
      return res.status(400).json({
        status: "error",
        msg: "Error en la autenticacion con google",
      });
    });
};

const totp_validate = (req, res = response) => {
  const { id, temp_token } = req.body;

  User.findOne({ _id: id }, (err, get_user) => {
    if (err) {
      return res.status(500).send({
        status: "error",
        msg: "Error algo salio mal",
      });
    }
    if (get_user) {
      if (
        !speakeasy.totp.verify({
          secret: get_user.secret_key,
          encoding: "base32",
          token: temp_token,
        })
      ) {
        return res.status(400).json({
          status: "error",
          msg: "Codigo no valido",
        });
      }

      User.findOneAndUpdate(
        { _id: id },
        { two_factors_activated: true },
        { new: true },
        (err, userUpdated) => {
          if (err || !userUpdated) {
            return res.status(500).send({
              status: "error",
              msg: "Por favor hable con el administrador",
            });
          }

          const token = createToken(
            get_user._id,
            get_user.email,
            get_user.given_name,
            get_user.family_name,
            get_user.role,
            (get_user.two_factors_activated = true)
          );

          return res.status(200).json({
            status: "success",
            msg: "Login correcto",
            token: token,
            user: {
              id: get_user._id,
              email: get_user.email,
              given_name: get_user.given_name,
              family_name: get_user.family_name,
              role: get_user.role,
              two_factors_activated: get_user.two_factors_activated,
            },
          });
        }
      );
    } else {
      return res.status(400).json({
        status: "error",
        msg: "Por favor hable con el administrador",
      });
    }
  });
};

const logout = (req, res = response) => {
  const { uid } = req.user;

  User.findOneAndUpdate(
    { _id: uid },
    { two_factors_activated: false },
    (err, userUpdated) => {
      if (err || !userUpdated) {
        return res.status(500).send({
          status: "error",
          msg: "Por favor hable con el administrador",
        });
      }

      return res.status(200).json({
        status: "success",
        msg: "Nos vemos pronto",
      });
    }
  );
};

const getUser = (req, res = response) => {
  var userId = req.user.uid;

  User.findById(userId).exec((err, get_user) => {
    if (err || !get_user) {
      return res.status(404).send({
        status: "error",
        message: "No existe el usuario",
      });
    }

    return res.status(200).send({
      status: "success",
      user: {
        id: get_user._id,
        email: get_user.email,
        given_name: get_user.given_name,
        family_name: get_user.family_name,
        role: get_user.role,
        two_factors_activated: get_user.two_factors_activated,
      },
    });
  });
};

module.exports = {
  register_login_google,
  totp_validate,
  getUser,
  logout,
};
