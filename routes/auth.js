const { Router } = require('express');
const { check } = require('express-validator');
const { validate_fields } = require('../middlewares/validate-fields');

var md_auth = require('../middlewares/authenticated');

const router = Router();

const { register_login_google, totp_generate, totp_validate, logout} = require('../controllers/auth');

router.post(
    '/',
    [
        check('idToken', 'token de google no recibido').not().isEmpty(),
        validate_fields,
    ], 
    register_login_google
);

router.post(
    "/totp-generate",
    [
        check('id', 'Id de usuario requerido').not().isEmpty(),
        validate_fields,
    ],
    totp_generate
);

router.post(
    "/totp-validate",
    [
        check('id', 'Id de usuario requerido').not().isEmpty(),
        check('temp_token', 'codigo token obligatorio').not().isEmpty(),
        validate_fields,
    ],
    totp_validate
);

router.get(
    "/logout",
    md_auth.authenticated,
    logout
);

module.exports = router;