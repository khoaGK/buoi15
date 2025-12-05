let products = [
  { id: 1, name: "Bàn phím cơ", price: 1200000 },
  { id: 2, name: "Máy tính bàn", price: 15000000 },
  { id: 3, name: "Laptop cơ bản", price: 22000000 }
];

function renderProducts() {
  const tbody = document.getElementById("productList");
  tbody.innerHTML = "";

  products.forEach((p) => {
    let row = `
      <tr>
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>${p.price.toLocaleString()}</td>
        <td>
          <button class="btn-edit" onclick="editProduct(${p.id})">Sửa</button>
          <button class="btn-delete" onclick="deleteProduct(${p.id})">Xóa</button>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

function addProduct() {
  const name = document.getElementById("name").value.trim();
  const price = Number(document.getElementById("price").value);

  if (!name || !price) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  const newProduct = {
    id: products.length ? products[products.length - 1].id + 1 : 1,
    name,
    price,
  };

  products.push(newProduct);
  renderProducts();

  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
}

function deleteProduct(id) {
  products = products.filter(p => p.id !== id);
  renderProducts();
}

function editProduct(id) {
  const product = products.find(p => p.id === id);

  const newName = prompt("Nhập tên mới:", product.name);
  const newPrice = prompt("Nhập giá mới:", product.price);

  if (newName && newPrice) {
    product.name = newName;
    product.price = Number(newPrice);
    renderProducts();
  }
}

// Hiển thị danh sách ban đầu
renderProducts();