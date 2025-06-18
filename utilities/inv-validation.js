const { body, validationResult } = require("express-validator");
const utilities = require("../utilities");

// CLassification
const classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Classification name is required.")
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("Provide a correct classication name"),
  ];
};

const checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    try {
      let nav = await utilities.getNav();
      res.render("inventory/add-classification", {
        errors,
        title: "Add Classification",
        nav,
        classification_name,
      });
    } catch (err) {
      console.error(
        "Error rendering add-classification form with validation errors:",
        err
      );
      res.status(500).send("Server error during classification validation.");
    }
    return;
  }

  next();
};

// Inventory
const inventoryRules = () => {
  return [
    body("classification_id")
      .isInt()
      .withMessage("Choose a valid classification."),
    body("inv_make").trim().isLength({ min: 1 }).withMessage("Enter a make."),
    body("inv_model").trim().isLength({ min: 1 }).withMessage("Enter a model."),
    body("inv_description")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Enter a description."),
    body("inv_image")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Enter an image path."),
    body("inv_thumbnail")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Enter a thumbnail path."),
    body("inv_price").isFloat({ gt: 0 }).withMessage("Enter a valid price."),
    body("inv_year").isInt({ min: 1900 }).withMessage("Enter a valid year."),
    body("inv_miles").isInt({ min: 0 }).withMessage("Enter mileage."),
    body("inv_color").trim().isLength({ min: 1 }).withMessage("Enter a color."),
  ];
};

const checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    try {
      let nav = await utilities.getNav();
      let classificationList = await utilities.buildClassificationList(
        req.body.classification_id
      );
      res.render("./inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        classificationList,
        errors,
        message: null,
        sticky: req.body,
      });
    } catch (err) {
      console.error(
        "Error rendering add-inventory form with validation errors:",
        err
      );
      res.status(500).send("Server error during inventory validation.");
    }
    return;
  }
  next();
};

module.exports = {
  classificationRules,
  checkClassificationData,
  inventoryRules,
  checkInventoryData,
};
