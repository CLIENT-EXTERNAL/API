const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const { Carousel } = require("../models");

const create = async (req, res) => {
    try {
        const host = req.get("host");

        let imageUrl = null;

        if (req.file) {
            const imageFile = req.file;
            imageUrl = `${req.protocol}://${host}/carousels/${imageFile.filename}`;
        }

        await Carousel.create({ image: imageUrl });

        return res.status(201).json({
            status: "success",
            message: "Carousel created successfully",
        });
        
    } catch (error) {
        console.error(`Error lors de la création du carousel: ${error}`);
        return res.status(500).json({
            status: "error",
            message: "Une erreur est survenue lors de la création du carousel.",
        });
    }
}

const list = async (req, res) => {
    try {
        const carousels = await Carousel.findAll({
            attributes: ["image"],
            order: [["createdAt", "DESC"]],
        });

        const formatedCarousels = carousels.map((carousel) => {
            return {
                image: carousel.image,
            };
        });

        return res.status(200).json({
            status: "success",
            data: formatedCarousels,
        });
    } catch (error) {
        console.error(`Error lors de la récupération des carousels: ${error}`);
        return res.status(500).json({
            status: "error",
            message: "Une erreur est survenue lors de la récupération des carousels.",
        });
    }
}

module.exports = { create, list };