// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to vehicle detail page
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildByVehicleId)
);

// Route to build the inventory management view
router.get("/", invController.buildManagement);

// Route to display the add classification form
router.get("/add-classification", invController.buildAddClassification);

// Route to display the add inventory form
router.get("/add-inventory", invController.buildAddInventory);

// Route to trigger an error for testing purposes
router.get("/error-test", utilities.handleErrors(invController.triggerError));

module.exports = router;
