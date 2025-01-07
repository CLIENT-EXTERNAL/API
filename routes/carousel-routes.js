const express = require("express");
const carouselController = require("../controllers/carousel-controller");
const upload = require("../middlewares/carousel-middleware");
const router = express.Router();

// CREATION
router.post("/create", upload.single("image"), carouselController.create);

// LIST
router.get("/list", carouselController.list);

module.exports = router;