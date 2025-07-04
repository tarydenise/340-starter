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

/* ***************************
 *  Build Management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();

  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    classificationSelect,
    errors: null,
    message: req.flash("message"),
  });
};

/* ***************************
 *  Build Add Classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    message: req.flash("notice"),
  });
};

// Add Classification
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body;
  const addResult = await invModel.addClassification(classification_name);

  if (addResult) {
    req.flash("notice", "New classification added successfully!");
    res.redirect("/inv");
  } else {
    let nav = await utilities.getNav();
    req.flash("notice", "Failed to add classification.");
    res.status(500).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      message: req.flash("notice"),
    });
  }
};

/* ***************************
 *  Build Add New Inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res) {
  try {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList();
    res.render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: null,
      message: req.flash("notice"),
      sticky: {},
    });
  } catch (error) {
    console.error("buildAddInventory error:", error);
    res.status(500).send("Something went wrong.");
  }
};

// Add Inventory
invCont.addInventory = async function (req, res) {
  const inventoryData = req.body;
  const addResult = await invModel.addInventory(inventoryData);

  if (addResult) {
    req.flash("notice", "New vehicle successfully added.");
    res.redirect("/inv");
  } else {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList(
      inventoryData.classification_id
    );
    req.flash("notice", "Error: Vehicle not added.");
    res.status(500).render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: null,
      message: req.flash("notice"),
      sticky: inventoryData,
    });
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0]?.inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ***************************
 *  Build edit inventory view
 * ************************** */
/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryById(inv_id);
  const classificationSelect = await utilities.buildClassificationList(
    itemData.classification_id
  );
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect,
    errors: null,
    messages: req.flash("notice"),
    sticky: {
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id,
    },
  });
};

/* ***************************
 *  Error Trigger for Testing
 * ************************** */
invCont.triggerError = (req, res, next) => {
  throw new Error("This is an intentional 500 error for testing.");
};

module.exports = invCont;
