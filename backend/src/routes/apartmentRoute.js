const express = require("express");
const router = express.Router();
const {
  getApartments,
  getApartmentById,
} = require("../controllers/apartmentController");

router.get("/", getApartments);
router.get("/:id", getApartmentById);

module.exports = router;
