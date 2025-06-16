const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByVehicleId = async function (req, res, next) {
  const inv_id = req.params.invId;
  const data = await invModel.getVehicleByInvId(inv_id);
  let nav = await utilities.getNav();

  // Format price and miles
  data.inv_price = Number(data.inv_price).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
  data.inv_miles = Number(data.inv_miles).toLocaleString();

  res.render("./inventory/vehicle", {
    title: `${data.inv_year} ${data.inv_make} ${data.inv_model}`,
    nav,
    vehicle: data,
  });
};

// Management View
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/management", {
    title: "Management",
    nav,
    errors: null,
  });
};

//Build ADD NEW CLASSIFICATION view
invCont.buildAddClassification = async (req, res) => {
  let nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  });
};

//Build ADD NEW INVENTORY view
invCont.buildAddInventory = async (req, res) => {
  let nav = await utilities.getNav();
  res.render("inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    errors: null,
  });
};

/* ***************************
 *  Error Trigger for Testing
 * ************************** */
invCont.triggerError = (req, res, next) => {
  throw new Error("This is an intentional 500 error for testing.");
};

module.exports = invCont;
