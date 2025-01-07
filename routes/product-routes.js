const express = require("express");
const productController = require("../controllers/product-controller");
const upload = require("../middlewares/product-middleware");
const router = express.Router();

// CREATION
router.post("/create", upload.single("image"), productController.create);

// LIST
router.get("/list", productController.list);

// SEARCH PRODUCT BY NAME
router.get("/search", productController.search);

// DELETE
router.delete("/delete/:id", productController.destroy);

module.exports = router;