// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const invValidation = require("../utilities/inv-validation");
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

// Route to show the add classification view
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
);

// Route to handle the POST submission
router.post(
  "/add-classification",
  invValidation.classificationRules(),
  invValidation.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// Show add inventory view
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
);

// Handle POST submission
router.post(
  "/add-inventory",
  invValidation.inventoryRules(),
  invValidation.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

// Route to trigger an error for testing purposes
router.get("/error-test", utilities.handleErrors(invController.triggerError));

// Inventory Route
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

// Route to build inventory edit view
router.get(
  "/edit/:inv_id",
  utilities.handleErrors(invController.editInventoryView)
);

module.exports = router;
