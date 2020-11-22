const { Router } = require("express");
const { check } = require("express-validator");
const { validate_fields } = require("../middlewares/validate-fields");

var md_auth = require("../middlewares/authenticated");

const router = Router();

const {
  register_login_google,
  totp_validate,
  logout,
  getUser,
} = require("../controllers/auth");

router.post(
  "/",
  [
    check("idToken", "token de google no recibido").not().isEmpty(),
    validate_fields,
  ],
  register_login_google
);

router.post(
  "/totp-validate",
  [
    check("id", "Id de usuario requerido").not().isEmpty(),
    check("temp_token", "codigo token obligatorio").not().isEmpty(),
    validate_fields,
  ],
  totp_validate
);

router.get("/get-user", md_auth.authenticated, getUser);

router.post(
  "/logout",
  [check("id", "Id de usuario requerido").not().isEmpty(), validate_fields],
  logout
);

module.exports = router;
