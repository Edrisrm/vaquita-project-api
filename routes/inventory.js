const { Router } = require("express");
const { check } = require("express-validator");
const { validate_fields } = require("../middlewares/validate-fields");
const router = Router();
const { save, getInventoryByStatus, deleteOneInventory, getRecords } = require("../controllers/inventory");

router.post(
  "/agregar-inventario",
  [
    check("breed", "La raza es requerida").not().isEmpty(),
    check("weight", "El peso es requerido").not().isEmpty(),
    check("division", "Se debe de asignar una finca").not().isEmpty(),
    check("age_in_months", "La edad en meses es requerido").not().isEmpty(),
    validate_fields,
  ],
  save
);
router.get("/inventario-en-finca/:page?", getInventoryByStatus);
router.get("/historicos/:page?", getRecords);
router.delete("/borrar-inventario", deleteOneInventory);
module.exports = router;
