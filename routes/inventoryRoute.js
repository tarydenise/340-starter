// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to vehicle detail page
router.get("/detail/:invId", utilities.handleErrors(invController.buildByVehicleId)
);

// Route to trigger an error for testing purposes
router.get("/error-test", utilities.handleErrors(invController.triggerError));

module.exports = router;