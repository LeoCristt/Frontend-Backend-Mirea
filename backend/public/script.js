document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById("product-list");
    const form = document.getElementById("product-form");
    const categorySelect = document.getElementById("category");

    async function fetchCategories() {
        const response = await fetch("/api/categories");
        const categories = await response.json();
        categorySelect.innerHTML = categories
            .map(cat => `<option value="${cat.id}">${cat.name}</option>`)
            .join('');
    }

    async function fetchProducts() {
        const response = await fetch("/api/products");
        const products = await response.json();
        productList.innerHTML = "";
        products.forEach(product => {
            const item = document.createElement("li");
            item.className = "bg-white p-4 rounded-lg shadow flex justify-between items-center";

            item.innerHTML = `
                <div>
                    <h3 class="text-lg font-semibold">${product.name}</h3>
                    <p class="text-sm text-gray-600">${product.description}</p>
                    <p class="text-sm text-gray-500 font-medium">Цена: <span class="text-green-600 font-bold">$${product.price}</span></p>
                    <p class="text-xs text-gray-400">Категории: ${product.categories.join(', ')}</p>
                </div>
                <div class="flex gap-2">
                    <button onclick="editProduct(${product.id})"
                        class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition">
                        ✏ Редактировать
                    </button>
                    <button onclick="deleteProduct(${product.id})"
                        class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">
                        🗑 Удалить
                    </button>
                </div>
            `;
            productList.appendChild(item);
        });
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const name = document.getElementById("name").value;
        const price = document.getElementById("price").value;
        const description = document.getElementById("description").value;
        const category = document.getElementById("category").value;
        await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, price, description, categories: [parseInt(category)] })
        });
        form.reset();
        fetchProducts();
    });

    window.editProduct = async (id) => {
        const newName = prompt("Введите новое имя:");
        const newPrice = prompt("Введите новую цену:");
        const newDescription = prompt("Введите новое описание:");
        const newCategory = prompt("Введите новую категорию (ID):");
        if (newName && newPrice && newCategory) {
            await fetch(`/api/products/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: newName,
                    price: newPrice,
                    description: newDescription,
                    categories: [parseInt(newCategory)]
                })
            });
            fetchProducts();
        }
    };

    window.deleteProduct = async (id) => {
        if (confirm("Вы уверены, что хотите удалить этот товар?")) {
            await fetch(`/api/products/${id}`, { method: "DELETE" });
            fetchProducts();
        }
    };

    fetchCategories();
    fetchProducts();
});

const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
let userNumber = null;

const socket = new WebSocket('ws://localhost:3001');

socket.onopen = () => {
    console.log("Подключение установлено");
};

socket.onmessage = (event) => {
    const { user, text } = JSON.parse(event.data);
    const message = document.createElement('p');
    message.innerHTML = `<strong>${user}:</strong> ${text}`;
    message.className = "p-2 bg-gray-200 rounded mb-1";
    messagesDiv.append(message);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
};

sendButton.addEventListener('click', () => {
    sendMessage();
});

messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
        socket.send(message);
        messageInput.value = '';
    }
}

function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
        socket.send(message);
        messageInput.value = '';
    }
}