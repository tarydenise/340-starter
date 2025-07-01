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
 * Deliver Management View
 * *****************************************/
router.get("/", utilities.checkJWTToken, accountController.accountManagement);

/* ******************************************
 * Process Registration
 * *****************************************/
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

/* ******************************************
 * Process Login
 * *****************************************/
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

module.exports = router;
