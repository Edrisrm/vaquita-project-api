const { Router } = require("express");
const { check } = require("express-validator");
const { validate_fields } = require("../middlewares/validate-fields");
const md_auth = require("../middlewares/authenticated");
const multipart = require("connect-multiparty");
const md_upload = multipart({ uploadDir: "./uploads/inventory" });

const router = Router();

const {
  save,
  getInventoryByStatus,
  deleteOneInventory,
  getRecords,
  update,
  uploadImage,
  getInventoryFiles,
} = require("../controllers/inventory");

router.post(
  "/agregar-inventario",
  [
    check("breed", "La raza es requerida").not().isEmpty(),
    check("weight", "El peso es requerido").not().isEmpty(),
    check("apartValue", "Se debe de asignar una finca").not().isEmpty(),
    check("age_in_months", "La edad en meses es requerido").not().isEmpty(),
    validate_fields,
  ],
  md_auth.authenticated,
  save
);
router.put(
  "/editar-inventario",
  [
    check("weight", "El peso es requerido").not().isEmpty(),
    check("age_in_months", "La edad en meses es requerido").not().isEmpty(),
    validate_fields,
  ],
  md_auth.authenticated,
  update
);
router.post(
  "/upload-inventory/:id",
  [md_auth.authenticated, md_upload],
  uploadImage
);

router.get("/inventory-file/:fileName", getInventoryFiles);
router.get(
  "/inventario-en-finca/:page?",
  md_auth.authenticated,
  getInventoryByStatus
);
router.get("/historicos/:page?", md_auth.authenticated, getRecords);
router.delete("/borrar-inventario", md_auth.authenticated, deleteOneInventory);
module.exports = router;
