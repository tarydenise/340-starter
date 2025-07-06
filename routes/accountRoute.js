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
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.accountManagement)
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

/* ******************************************
 * Process Login
 * *****************************************/
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

/* ******************************************
 * Process Logout
 * *****************************************/
router.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  req.flash("notice", "You have been logged out.");
  res.redirect("/");
});

// Show the update account info form (GET)
router.get(
  "/update/:id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.showUpdateAccount)
);

// Handle the update POST request
router.post(
  "/update",
  utilities.checkLogin,
  utilities.handleErrors(accountController.updateAccount)
);

// POST route to update the password
router.post(
  "/update-password",
  utilities.checkLogin,
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
);

module.exports = router;
