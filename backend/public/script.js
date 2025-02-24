document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById("product-list");
    const form = document.getElementById("product-form");
    const categorySelect = document.getElementById("category");

    async function fetchCategories() {
        const response = await fetch("/api/categories");
        const categories = await response.json();
        categorySelect.innerHTML = categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
    }

    async function fetchProducts() {
        const response = await fetch("/api/products");
        const products = await response.json();
        productList.innerHTML = "";
        products.forEach(product => {
            const item = document.createElement("li");
            item.innerHTML = `${product.name},Описание:${product.description}  - $${product.price} (Категории: ${product.categories.join(', ')}) 
                <button onclick="editProduct(${product.id})">✏️</button>
                <button onclick="deleteProduct(${product.id})">❌</button>`;
            productList.appendChild(item);
        });
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const name = document.getElementById("name").value;
        const price = document.getElementById("price").value;
        const category = document.getElementById("category").value;
        await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, price, categories: [parseInt(category)] })
        });
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
                body: JSON.stringify({ name: newName, price: newPrice, description:newDescription, categories: [parseInt(newCategory)] })
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
