const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const dataPath = path.join(__dirname, 'data', 'products.json');

app.get('/api/categories', (req, res) => {
    const data = JSON.parse(fs.readFileSync(dataPath));
    res.json(data.categories);
});

app.get('/api/products', (req, res) => {
    const data = JSON.parse(fs.readFileSync(dataPath));
    res.json(data.products);
});

app.post('/api/products', (req, res) => {
    const data = JSON.parse(fs.readFileSync(dataPath));
    const newProduct = { id: Date.now(), ...req.body };
    data.products.push(newProduct);
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    res.redirect('/');
});

app.put('/api/products/:id', (req, res) => {
    let data = JSON.parse(fs.readFileSync(dataPath));
    const index = data.products.findIndex(p => p.id === parseInt(req.params.id));
    if (index !== -1) {
        data.products[index] = { ...data.products[index], ...req.body };
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    }
    res.redirect('/');
});

app.delete('/api/products/:id', (req, res) => {
    let data = JSON.parse(fs.readFileSync(dataPath));
    data.products = data.products.filter(p => p.id !== parseInt(req.params.id));
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Backend API запущен на http://localhost:${PORT}`);
});