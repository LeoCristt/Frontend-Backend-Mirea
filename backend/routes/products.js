const express = require("express");
const router = express.Router();
const data = require("../data/products.json");

router.get("/", (req, res) => {
    res.json(data.products);
});

router.get("/:id", (req, res) => {
    const product = data.products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ message: "Товар не найден" });
    res.json(product);
});

router.get("/category/:categoryId", (req, res) => {
    const categoryId = parseInt(req.params.categoryId);
    const products = data.products.filter(p => p.categories.includes(categoryId));
    res.json(products);
});

module.exports = router;
