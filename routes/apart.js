const {Router} = require("express");
const {check} = require("express-validator");
const {validate_fields} = require("../middlewares/validate-fields");
const router = Router();
const {save, getAparts, deleteOneApart } = require("../controllers/apart");


var md_auth = require("../middlewares/authenticated");

router.post(
    "/agregar-apartado",
    [
        check("square_meter", "Los metros cuadrados son requeridos").not().isEmpty(),
        check("apart_number", "El número de aparto es requerido").not().isEmpty(),
        validate_fields,
    ]
    ,md_auth.authenticated,
    save
);
router.get("/apartos", md_auth.authenticated, getAparts);
router.delete("/borrar-aparto/", md_auth.authenticated, deleteOneApart);
module.exports = router;