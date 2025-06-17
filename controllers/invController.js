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
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
    message: req.flash("message"),
  });
};

// ADD NEW CLASSIFICATION view
invCont.buildAddClassification = async function (req, res) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    message: req.flash("message"),
  });
};

invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body;
  const addResult = await invModel.addClassification(classification_name);

  if (addResult) {
    req.flash("message", "New classification added successfully!");
    res.redirect("/inv");
  } else {
    let nav = await utilities.getNav();
    req.flash("message", "Failed to add classification.");
    res.status(500).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
      message: req.flash("message"),
    });
  }
};

// ADD NEW INVENTORY view
invCont.buildAddInventory = async function (req, res) {
  try {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList();
    res.render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: null,
      message: req.flash("message"),
      sticky: {},
    });
  } catch (error) {
    console.error("buildAddInventory error:", error);
    res.status(500).send("Something went wrong.");
  }
};

invCont.addInventory = async function (req, res) {
  const inventoryData = req.body;
  const addResult = await invModel.addInventory(inventoryData);

  if (addResult) {
    req.flash("message", "New vehicle successfully added.");
    res.redirect("/inv");
  } else {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList(
      inventoryData.classification_id
    );
    req.flash("message", "Error: Vehicle not added.");
    res.status(500).render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: null,
      message: req.flash("message"),
      sticky: inventoryData,
    });
  }
};

/* ***************************
 *  Error Trigger for Testing
 * ************************** */
invCont.triggerError = (req, res, next) => {
  throw new Error("This is an intentional 500 error for testing.");
};

module.exports = invCont;
