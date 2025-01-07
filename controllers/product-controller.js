const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const { Op } = require("sequelize");
const { Product } = require("../models");

const create = async (req, res) => {
  try {
    const host = req.get("host");
    const { title, description, price } = req.body;

    if (!title) {
      return res
        .status(400)
        .json({ status: "error", message: "Title is required" });
    }

    if (!description) {
      return res
        .status(400)
        .json({ status: "error", message: "Description is required" });
    }

    if (!price) {
      return res
        .status(400)
        .json({ status: "error", message: "Price is required" });
    }

    const existingProduct = await Product.findOne({
      where: { title },
    });

    if (existingProduct) {
      return res
        .status(400)
        .json({ status: "error", message: "Product already exists" });
    }

    let imageUrl = null;
    let thumbnailImageUrl = null;

    if (req.file) {
      const imageFile = req.file;
      imageUrl = `${req.protocol}://${host}/products/${imageFile.filename}`;

      const thumbnailBuffer = await sharp(req.file.path)
        .resize(350, 350)
        .toBuffer();
      const thumbnailFilename = `thumbnail-${req.file.filename}`;
      const thumbnailPath = path.join("public", "products", thumbnailFilename);
      await fs.promises.writeFile(thumbnailPath, thumbnailBuffer);

      thumbnailImageUrl = `${req.protocol}://${host}/products/${thumbnailFilename}`;
    }

    await Product.create({
      title,
      description,
      price,
      image: imageUrl,
      thumbnail: thumbnailImageUrl,
    });

    return res.status(201).json({
      status: "success",
      message: "Product created successfully",
    });

  } catch (error) {
    console.error(`Error lors de la création du produit: ${error}`);
    return res.status(500).json({
      status: "error",
      message: "Une erreur est survenue lors de la création du produit.",
    });
  }
};

const list = async (req, res) => {
    try {
        const products = await Product.findAll({
            attributes: ["id", "title", "description", "price", "image", "thumbnail"],
            order: [["createdAt", "DESC"]],
        });

        const formatedProducts = products.map((product) => {
            return {
                id: product.id,
                title: product.title,
                description: product.description,
                price: product.price,
                image: product.image,
                thumbnail: product.thumbnail,
            };
        });

        return res.status(200).json({
            status: "success",
            data: formatedProducts,
        });
    } catch (error) {
        console.error(`Error lors de la récupération des produits: ${error}`);
        return res.status(500).json({
            status: "error",
            message: "Une erreur est survenue lors de la récupération des produits.",
        });
    }
}

const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }
    await product.destroy();
    return res.status(200).json({
      status: "success",
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(`Error lors de la suppression du produit: ${error}`);
    return res.status(500).json({
      status: "error",
      message: "Une erreur est survenue lors de la suppression du produit.",
    });
  }
};

const search = async (req, res) => {
  try {
    const { title } = req.query;
    const products = await Product.findAll({
      where: {
        title: {
          [Op.iLike]: `%${title}%`,
        },
      },
    });

    const formatedProducts = products.map((product) => {
      return {
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        image: product.image,
        thumbnail: product.thumbnail,
      };
    });

    return res.status(200).json({
      status: "success",
      data: formatedProducts,
    });
  } catch (error) {
    console.error(`Error lors de la recherche des produits: ${error}`);
    return res.status(500).json({
      status: "error",
      message: "Une erreur est survenue lors de la recherche des produits.",
    });
  }
};

module.exports = {
  create,
  list,
  destroy,
  search
};
