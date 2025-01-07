const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
const morgan = require("morgan");
const helmet = require("helmet");
const fs = require("fs");
const permissionsPolicy = require("permissions-policy");

// ROUTES
const productRoutes = require("./routes/product-routes");
const carouselRoutes = require("./routes/carousel-routes");

// INIT
const app = express();

// LOGGER
app.use(morgan("dev"));

// MIDDLEWARES
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MIDDLEWARES IMAGES PRODUCTS
const createUploadsProductFolder = (req, res, next) => {
  const folderPath = "public/products";
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
  next();
};
const createUploadsCarouselFolder = (req, res, next) => {
    const folderPath = "public/carousels";
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    next();
  };

// PUBLIC FOLDER
app.use(express.static("public"));

// Implement security measures
// XSS protection
app.use(helmet.xssFilter());
app.use(helmet.frameguard({ action: "sameorigin" }));
app.use(helmet.dnsPrefetchControl());
app.use(helmet.referrerPolicy({ policy: "same-origin" }));
app.use(helmet.hsts());
app.use(helmet.noSniff());
app.use(helmet());

// CSP protection
app.use(
  helmet.contentSecurityPolicy({ directives: { defaultSrc: ["'self'"] } })
);

// Permissions policy
app.use(
  permissionsPolicy({
    features: {
      payment: ["self", '"nyota-api.com"'],
      syncXhr: [],
    },
  })
);


// Routes
app.use("/api/v1/product", createUploadsProductFolder, productRoutes);
app.use("/api/v1/carousel", createUploadsCarouselFolder, carouselRoutes);

// Export app
const port = process.env.PORT || 3000;

// Start server
app.listen(port, () => {
  console.log(`
  =============================
  | 🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀|
  |======= API STARTED =======|
  | 🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀|
  =============================
  `);
});