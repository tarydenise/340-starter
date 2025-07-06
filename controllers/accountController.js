const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* **************************
 * Deliver login view
 * *************************/
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    messages: req.flash("notice"),
  });
}
/* **************************
 * Deliver Registration view
 * *************************/
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    messages: req.flash("notice"),
    errors: null,
  });
}

/* ****************************************
 *  Deliver Account Management View
 * ************************************ */
async function accountManagement(req, res) {
  let nav = await utilities.getNav();
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    messages: req.flash("notice"),
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password here
  const hashedPassword = await bcrypt.hash(account_password, 10);

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword // Store the hashed password!
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    );
    res.redirect("/account/login");
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      messages: req.flash("notice"),
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
      messages: req.flash("notice"),
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account/");
    } else {
      req.flash("notice", "Please check your credentials and try again.");
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
        messages: req.flash("notice"),
      });
    }
  } catch (error) {
    throw new Error("Access Forbidden");
  }
}

/* ****************************************
 *  Update Account
 * ************************************ */

async function showUpdateAccount(req, res, next) {
  const account_id = req.params.id;
  const accountData = await accountModel.getAccountById(account_id);
  let nav = await utilities.getNav();
  res.render("account/update-account", {
    title: "Update Account Information",
    nav,
    accountData,
    errors: null,
    messages: req.flash("notice"),
  });
}

async function updateAccount(req, res, next) {
  const { account_id, account_firstname, account_lastname, account_email } =
    req.body;
  // 1. Update the database
  const updateResult = await accountModel.updateAccount({
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  });

  if (updateResult) {
    const updatedAccount = await accountModel.getAccountById(account_id);

    delete updatedAccount.account_password;

    const accessToken = jwt.sign(
      updatedAccount,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 3600 * 1000 }
    );
    if (process.env.NODE_ENV === "development") {
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
    } else {
      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 3600 * 1000,
      });
    }
    req.flash("notice", "Account updated successfully!");
    res.redirect("/account/");
  } else {
    let nav = await utilities.getNav();
    res.status(500).render("account/update-account", {
      title: "Update Account Information",
      nav,
      accountData: req.body,
      errors: ["Update failed. Please try again."],
      messages: req.flash("notice"),
    });
  }
}

/* ****************************************
 *  Process Password Change
 * *************************************** */
/* ****************************************
 *  Update Account Password
 * ************************************ */
async function updatePassword(req, res) {
  let nav = await utilities.getNav();
  const { account_id, account_password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(account_password, 10);
    const result = await accountModel.updateAccountPassword(account_id, hashedPassword);

    if (result) {
      req.flash("notice", "Password updated successfully!");
      res.redirect("/account/");
    } else {
      const accountData = await accountModel.getAccountById(account_id);
      res.status(500).render("account/update-account", {
        title: "Update Account Information",
        nav,
        accountData,
        errors: [],
        passwordErrors: ["Password update failed. Please try again."],
        messages: req.flash("notice"),
      });
    }
  } catch (error) {
    const accountData = await accountModel.getAccountById(account_id);
    res.status(500).render("account/update-account", {
      title: "Update Account Information",
      nav,
      accountData,
      errors: [],
      passwordErrors: ["Password update failed. Please try again."],
      messages: req.flash("notice"),
    });
  }
}
module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  accountManagement,
  showUpdateAccount,
  updateAccount,
  updatePassword,
};
