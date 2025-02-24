const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const productRoutes = require("./routes/products");
const categoryRoutes = require("./routes/categories");

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);

app.listen(PORT, () => {
    console.log(`API сервер запущен на http://localhost:${PORT}`);
});
