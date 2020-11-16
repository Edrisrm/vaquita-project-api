const {Router} = require("express");
const {check} = require("express-validator");
const {validate_fields} = require("../middlewares/validate-fields");
const router = Router();
const {save, getAparts, deleteApart } = require("../controllers/apart");

router.post(
    "/agregar-apartado",
    [
        check("square_meter", "Los metros cuadrados son requeridos").not().isEmpty(),
        check("apart_number", "El número de aparto es requerido").not().isEmpty(),
        validate_fields,
    ],
    save
);
router.get("/apartos", getAparts);
router.delete("/borrar-aparto",deleteApart);
module.exports = router;