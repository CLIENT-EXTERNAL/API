const express = require("express");
const carouselController = require("../controllers/carousel-controller");
const upload = require("../middlewares/carousel-middleware");
const router = express.Router();

// CREATION
router.post("/carousel/create", upload.single("image"), carouselController.create);

// LIST
router.get("/carousel/list", carouselController.list);

module.exports = router;