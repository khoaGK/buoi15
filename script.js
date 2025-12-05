// Khai báo key lưu trữ
const STORAGE_KEY = 'productData';
const form = document.getElementById('add-product-form');
const nameInput = document.getElementById('product-name');
const priceInput = document.getElementById('product-price');
const submitButton = document.getElementById('submit-button');
const tableBody = document.getElementById('product-table-body');

let products = [];
let nextId = 1;
let isEditing = false;
let currentEditId = null;

// --- A. Tương tác với Bộ nhớ trình duyệt (localStorage) ---
function getProductsFromStorage() {
    try {
        const json = localStorage.getItem(STORAGE_KEY);
        return json ? JSON.parse(json) : [];
    } catch (e) {
        console.error("Lỗi khi tải dữ liệu từ localStorage:", e);
        return [];
    }
}

function saveProductsToStorage() {
    try {
        const json = JSON.stringify(products);
        localStorage.setItem(STORAGE_KEY, json);
    } catch (e) {
        console.error("Lỗi khi lưu dữ liệu vào localStorage:", e);
    }
}

// --- B. Chức năng Hiển thị (Read) ---
function renderProducts() {
    tableBody.innerHTML = '';
    
    products.forEach(product => {
        const row = tableBody.insertRow();
        
        row.insertCell().textContent = product.id;
        row.insertCell().textContent = product.name;
        // Định dạng giá trị tiền tệ Việt Nam
        row.insertCell().textContent = product.price.toLocaleString('vi-VN') + ' VNĐ';

        const actionCell = row.insertCell();

        // Nút Sửa
        const editButton = document.createElement('button');
        editButton.textContent = 'Sửa';
        editButton.className = 'btn btn-warning btn-sm';
        editButton.onclick = () => startEdit(product.id);
        
        // Nút Xóa
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Xóa';
        deleteButton.className = 'btn btn-danger btn-sm';
        deleteButton.onclick = () => handleDelete(product.id);

        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);
    });
}

// --- C. Xử lý Form (Thêm/Sửa) ---
function handleSubmit(event) {
    event.preventDefault(); 

    const name = nameInput.value.trim();
    const price = parseFloat(priceInput.value);

    if (!name || isNaN(price) || price <= 0) {
        alert('Vui lòng nhập tên sản phẩm và giá hợp lệ.');
        return;
    }

    if (isEditing) {
        // Chế độ Sửa (Update)
        const index = products.findIndex(p => p.id === currentEditId);
        if (index !== -1) {
            products[index].name = name;
            products[index].price = price;
        }
        // Trả form về trạng thái Thêm
        stopEdit(); 
    } else {
        // Chế độ Thêm (Create)
        const newProduct = {
            id: nextId++,
            name: name,
            price: price
        };
        products.push(newProduct);
    }

    saveProductsToStorage();
    renderProducts();
    
    // Reset form
    nameInput.value = '';
    priceInput.value = '';
}

// --- D. Chức năng Sửa (Update Logic) ---
function startEdit(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        // Đặt trạng thái Sửa
        isEditing = true;
        currentEditId = id;
        
        // Đổ dữ liệu vào form
        nameInput.value = product.name;
        priceInput.value = product.price;
        
        // Thay đổi nút submit
        submitButton.textContent = 'Lưu Thay Đổi';
        submitButton.className = 'btn btn-success';
    }
}

function stopEdit() {
    isEditing = false;
    currentEditId = null;
    submitButton.textContent = 'Thêm Sản phẩm';
    submitButton.className = 'btn btn-primary';
}

// --- E. Chức năng Xóa (Delete) ---
function handleDelete(id) {
    if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm ID ${id} không?`)) {
        products = products.filter(product => product.id !== id);
        saveProductsToStorage(); 
        renderProducts();
        
        // Nếu đang sửa sản phẩm bị xóa, thì dừng chế độ sửa
        if (isEditing && currentEditId === id) {
            stopEdit();
            nameInput.value = '';
            priceInput.value = '';
        }
    }
}

// --- F. Khởi tạo và Lắng nghe sự kiện ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Tải dữ liệu ban đầu
    products = getProductsFromStorage();
    
    // 2. Tính toán ID tiếp theo
    if (products.length > 0) {
        // Tìm ID lớn nhất và + 1
        nextId = Math.max(...products.map(p => p.id)) + 1;
    }
    
    // 3. Hiển thị dữ liệu
    renderProducts();
    
    // 4. Lắng nghe sự kiện submit form
    form.addEventListener('submit', handleSubmit);
});
