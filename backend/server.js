const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const app = express();
const PORT = 3000;

const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const dataPath = path.join(__dirname, "data", "products.json");

function readData() {
  return JSON.parse(fs.readFileSync(dataPath, "utf8"));
}

function writeData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf8");
}

app.get("/api/categories", (req, res) => {
  const data = readData();
  res.json(data.categories);
});

app.get("/api/products", (req, res) => {
  const data = readData();
  res.json(data.products);
});

app.get("/api/products/category/:categoryId", (req, res) => {
    const data = readData();
    const categoryId = parseInt(req.params.categoryId);
  
    const filteredProducts = data.products.filter((product) =>
      product.categories.includes(categoryId)
    );
  
    res.json(filteredProducts);
  });
  

app.post("/api/products", (req, res) => {
  const data = readData();
  const newProduct = { id: Date.now(), ...req.body };
  data.products.push(newProduct);
  writeData(data);
  res.json(newProduct);
});

app.put("/api/products/:id", (req, res) => {
  let data = readData();
  const index = data.products.findIndex((p) => p.id === parseInt(req.params.id));
  if (index !== -1) {
    data.products[index] = { ...data.products[index], ...req.body };
    writeData(data);
    res.json(data.products[index]);
  } else {
    res.status(404).json({ message: "Продукт не найден" });
  }
});

app.delete("/api/products/:id", (req, res) => {
  let data = readData();
  data.products = data.products.filter((p) => p.id !== parseInt(req.params.id));
  writeData(data);
  res.json({ message: "Продукт удалён" });
});

app.listen(PORT, () => {
  console.log(`Backend API запущен на http://localhost:${PORT}`);
});
