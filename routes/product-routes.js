const express = require("express");
const productController = require("../controllers/product-controller");
const upload = require("../middlewares/product-middleware");
const router = express.Router();

// CREATION
router.post("/product/create", upload.single("image"), productController.create);

// LIST
router.get("/product/list", productController.list);

// SEARCH PRODUCT BY NAME
router.get("/product/search", productController.search);

// DELETE
router.delete("/product/delete/:id", productController.destroy);

module.exports = router;