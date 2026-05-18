const express = require("express");
const router = express.Router();
const {
  getApartments,
  getApartmentById,
  getApartmentsByCategory,
  getTopFeatures,
} = require("../controllers/apartmentController");

router.get("/", getApartments);
router.get("/:id", getApartmentById);
router.get("/category/:categoryId", getApartmentsByCategory);
router.get("/top-features", getTopFeatures);

module.exports = router;
