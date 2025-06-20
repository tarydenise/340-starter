// Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");

/* ******************************************
 * Deliver Login View
 * *****************************************/
router.get("/login", utilities.handleErrors(accountController.buildLogin));

/* ******************************************
 * Deliver Registration View
 * *****************************************/
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

/* ******************************************
 * Process Registration
 * *****************************************/
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

module.exports = router;
