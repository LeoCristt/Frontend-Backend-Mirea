const express = require("express");
const router = express.Router();
const data = require("../data/products.json");

router.get("/", (req, res) => {
    res.json(data.categories);
});

module.exports = router;
