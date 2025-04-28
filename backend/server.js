const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const dataPath = path.join(__dirname, "data", "products.json");

function readData() {
  return JSON.parse(fs.readFileSync(dataPath, "utf8"));
}

const schema = buildSchema(`
  type Category {
    id: Int
    name: String
  }

  type Product {
    id: Int
    name: String
    price: Float
    description: String
    categories: [Int]
  }

  type Query {
    categories: [Category]
    products: [Product]
    product(id: Int!): Product
    filteredProducts(categoryId: Int, fields: [String]!): [Product]
  }
`);


const root = {
  categories: () => readData().categories,

  products: () => readData().products,

  product: ({ id }) => readData().products.find((p) => p.id === id),

  filteredProducts: ({ categoryId, fields }) => {
    let products = readData().products;

    if (categoryId) {
      products = products.filter((p) => p.categories.includes(categoryId));
    }

    return products.map((product) => {
      let filteredProduct = {};
      fields.forEach((field) => {
        if (product[field] !== undefined) {
          filteredProduct[field] = product[field];
        }
      });
      return filteredProduct;
    });
  },
};

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

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

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3001 });

let userCount = 0; 

wss.on('connection', (ws) => {
  userCount++;
  ws.userNumber = userCount;

  console.log(`Пользователь ${ws.userNumber} подключился`);

  ws.on('message', (message) => {
    const textMessage = message.toString();
    console.log(`Сообщение от Пользователь ${ws.userNumber}: ${textMessage}`);
    
    const msgData = JSON.stringify({ user: `Пользователь ${ws.userNumber}`, text: textMessage });

    // Рассылаем сообщение всем клиентам
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(msgData);
      }
    });
  });

  ws.on('close', () => {
    console.log(`Пользователь ${ws.userNumber} отключился`);
  });
});

console.log('Сервер запущен на http://localhost:3001');


console.log('Сервер запущен на http://localhost:3001');


const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Product API with WebSocket Chat",
      description: "API для управления товарами и чат на WebSocket",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development Server",
      },
      {
        url: "ws://localhost:3001",
        description: "WebSocket Server",
      },
    ],
  },
  apis: ["./swagger.yaml"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

console.log("Swagger UI доступен по адресу: http://localhost:3000/api-docs");